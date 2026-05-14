import { Either, left, right } from "../../../../../core/either";
import { UsersRepository } from "../../../repositories/users-repository";
import { PasswordResetTokensRepository } from "../../../repositories/password-reset-tokens-repository";
import { ResetPasswordDTO } from "./reset-password-dto";
import { InvalidTokenError } from "../../_errors/invalid-token-error";
import { Password } from "../../../../enterprise/entities/value-objects/password";

type ResetPasswordUseCaseResponse = Either<InvalidTokenError, null>;

export class ResetPasswordUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private passwordResetTokensRepository: PasswordResetTokensRepository,
  ) {}

  async execute({ token, newPassword }: ResetPasswordDTO): Promise<ResetPasswordUseCaseResponse> {
    const passwordResetToken = await this.passwordResetTokensRepository.findByToken(token);

    if (!passwordResetToken) {
      return left(new InvalidTokenError());
    }

    const isTokenExpired = new Date() > passwordResetToken.expiresAt;

    if (isTokenExpired) {
      await this.passwordResetTokensRepository.deleteById(passwordResetToken.id);
      return left(new InvalidTokenError());
    }

    const user = await this.usersRepository.findById(passwordResetToken.userId);

    if (!user) {
      return left(new InvalidTokenError());
    }

    const hashedPassword = await Password.generateHashFromPlainText(newPassword, 8);

    user.password = hashedPassword;

    await this.usersRepository.save(user);

    await this.passwordResetTokensRepository.deleteById(passwordResetToken.id);

    return right(null);
  }
}
