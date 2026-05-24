import { Either, left, right } from "../../../../../core/either";
import { UsersRepository } from "../../../repositories/users-repository";
import { PasswordResetTokensRepository } from "../../../repositories/password-reset-tokens-repository";
import { MailProvider } from "../../../providers/mail-provider";
import { RequestPasswordResetDTO } from "./request-password-reset-dto";
import { randomUUID } from "node:crypto";

type RequestPasswordResetUseCaseResponse = Either<Error, null>;

export class RequestPasswordResetUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordResetTokensRepository: PasswordResetTokensRepository,
    private mailProvider: MailProvider,
  ) {}

  async execute({ email }: RequestPasswordResetDTO): Promise<RequestPasswordResetUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      // Retornar sucesso mesmo se o usuário não existir é uma boa prática de segurança
      // para evitar enumeração de e-mails (descobrir quem tem conta ou não).
      return right(null);
    }

    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Token válido por 10 minutos

    await this.passwordResetTokensRepository.create({
      userId: user.id.toString(),
      token,
      expiresAt,
    });

    // TODO: Ajustar para a URL real do front-end depois
    const resetLink = `https://anuncia.ai/reset-password?token=${token}`;

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Recuperação de Senha - Anuncia.ai</h2>
        <p>Olá ${user.name},</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
        <p>Clique no botão abaixo para criar uma nova senha. Este link é válido por <strong>10 minutos</strong>.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Redefinir Minha Senha</a>
        </div>
        <p>Se você não solicitou essa alteração, por favor, ignore este e-mail.</p>
        <hr style="border: 1px solid #eaeaea; margin-top: 40px;" />
        <p style="color: #666; font-size: 12px;">Equipe Anuncia.ai</p>
      </div>
    `;

    try {
      await this.mailProvider.sendMail({
        to: email,
        subject: "Redefinição de Senha - Anuncia.ai",
        body: emailHtml,
      });
    } catch {
      return left(new Error("Falha ao enviar e-mail de recuperação."));
    }

    return right(null);
  }
}
