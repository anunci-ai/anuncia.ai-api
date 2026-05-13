import { ProfileData } from "../../../core/repositories/profile-data";
import { User } from "../../enterprise/entities/user";

export interface UsersRepository {
  findByIdAndGetSubscription(id: string): Promise<ProfileData | null>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User, trx?: unknown): Promise<User>;
}
