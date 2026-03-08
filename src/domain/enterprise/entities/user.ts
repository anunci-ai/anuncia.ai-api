import { Entity } from "../../../core/entitites/Entity";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { Optional } from "../../../core/types/optional";
import { Password } from "./value-objects/password";

interface UserProps {
  name: string;
  email: string;
  password?: Password;
  createdAt?: Date;
}

export class User extends Entity<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  static create(props: Optional<UserProps, "createdAt">, id?: UniqueEntityId) {
    const user = new User({ ...props, createdAt: new Date() }, id);

    return user;
  }
}
