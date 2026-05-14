export interface PasswordResetTokenData {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface PasswordResetTokensRepository {
  create(data: { userId: string; token: string; expiresAt: Date }): Promise<void>;
  findByToken(token: string): Promise<PasswordResetTokenData | null>;
  deleteById(id: string): Promise<void>;
}
