import { sign } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { UsersRepository } from "../repositories/users-repository";
import { User } from "../../enterprise/entities/user";
import { env } from "../../../infra/env";
import { Either, left, right } from "../../../core/either";

export class InvalidGoogleTokenError extends Error {
  constructor() {
    super("O token fornecido pelo Google é invalido ou expirou");
    this.name = "InvalidGoogleTokenError";
  }
}

type TokenResponse = {
  token: string;
};

type AuthenticateWithGoogleUseCaseRequest = {
  idToken: string;
};

type AuthenticateWithGoogleUseCaseResponse = Either<InvalidGoogleTokenError, TokenResponse>;

export class AuthenticateWithGoogleUseCase {
  private googleClient: OAuth2Client;

  constructor(private usersRepository: UsersRepository) {
    // Instanciamos o cliente do Google usando o Client ID que virá das variáveis de ambiente
    this.googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
  }

  async execute({ idToken }: AuthenticateWithGoogleUseCaseRequest): Promise<AuthenticateWithGoogleUseCaseResponse> {
    try {
      // 1. Validar o token recebido do Front-end com os servidores do Google
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: env.GOOGLE_CLIENT_ID,
      });

      // 2. Extrair os dados do perfil do Google
      const payload = ticket.getPayload();

      if (!payload || !payload.email || !payload.name) {
        return left(new InvalidGoogleTokenError());
      }

      const { email, name } = payload;

      // 3. Verificar se o utilizador já existe na nossa base de dados
      let user = await this.usersRepository.findByEmail(email);

      // 4. Se não existir, fazemos a inserção automática (primeiro acesso)
      if (!user) {
        user = User.create({
          name,
          email,
          // Não passamos password aqui
        });

        await this.usersRepository.save(user);
      }

      // 5. Gerar o token JWT da nossa API para o Front-end prosseguir
      const token = sign({ sub: user.id.toString() }, env.JWT_SECRET, { expiresIn: "1d" });

      return right({ token });
    } catch {
      // Se a biblioteca do Google atirar um erro (token falso, expirado, etc), caímos aqui
      return left(new InvalidGoogleTokenError());
    }
  }
}
