import { Entity } from "../../../core/entities/Entity";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Optional } from "../../../core/types/optional";
import { Password } from "./value-objects/password";

interface UserProps {
  name: string;
  avatarUrl?: string;
  email: string;
  password?: Password;
  createdAt?: Date;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<UserProps, "createdAt">, id?: UniqueEntityId) {
    const user = new User({ ...props, createdAt: new Date() }, id);

    return user;
  }
}
