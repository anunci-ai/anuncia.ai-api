import { Entity } from "../../../core/entitites/Entity";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { Password } from "./value-objects/password";

interface UserProps {
  name: string;
  email: string;
  password?: Password;
}

export class User extends Entity<UserProps> {
  get email() {
    return this.props.email;
  }

  static create(props: UserProps, id?: UniqueEntityId) {
    const user = new User(props, id);

    return user;
  }
}
