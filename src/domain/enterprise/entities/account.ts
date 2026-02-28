import { Entity } from "../../../core/entitites/Entity";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";

interface AccountProps {
  provider: "GOOGLE";
  providerAccountId: string;
  userId: UniqueEntityId;
}

export class Account extends Entity<AccountProps> {
  static create(props: AccountProps, id?: UniqueEntityId) {
    const account = new Account(props, id);

    return account;
  }
}
