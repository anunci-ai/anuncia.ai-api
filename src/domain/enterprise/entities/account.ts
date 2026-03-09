import { Entity } from "../../../core/entitites/Entity";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { Optional } from "../../../core/types/optional";

enum ProviderEnum {
  GOOGLE,
}

interface AccountProps {
  userId: UniqueEntityId;
  provider: ProviderEnum;
  providerAccountId: string;
  createdAt?: Date;
}

export class Account extends Entity<AccountProps> {
  static create(props: Optional<AccountProps, "createdAt">, id?: UniqueEntityId) {
    const account = new Account({ ...props, createdAt: new Date() }, id);

    return account;
  }
}
