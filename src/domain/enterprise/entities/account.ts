import { Entity } from "../../../core/entities/Entity";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Optional } from "../../../core/types/optional";

export enum ProviderEnum {
  GOOGLE = "GOOGLE",
}

interface AccountProps {
  userId: UniqueEntityId;
  provider: ProviderEnum;
  providerAccountId: string;
  createdAt?: Date;
}

export class Account extends Entity<AccountProps> {
  get userId() {
    return this.props.userId;
  }

  get provider() {
    return this.props.provider;
  }

  get providerAccountId() {
    return this.props.providerAccountId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<AccountProps, "createdAt">, id?: UniqueEntityId) {
    const account = new Account({ ...props, createdAt: new Date() }, id);

    return account;
  }
}
