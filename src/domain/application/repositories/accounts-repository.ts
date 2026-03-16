import { Account } from "../../enterprise/entities/account";

export interface AccountsRepository {
  save(account: Account, trx: unknown): Promise<Account>;
}
