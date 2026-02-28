import { compare, hash } from "bcryptjs";

export class Password {
  public value: string;

  constructor(value: string) {
    this.value = value;
  }

  toString() {
    return this.value;
  }

  static create(password: string) {
    return new Password(password);
  }

  static async generateHashFromPlainText(password: string, round: number) {
    const passwordHash = await hash(password, round);

    return new Password(passwordHash);
  }

  static async isValid(password: string, hash: string): Promise<boolean> {
    const passwordMatchWithHash = await compare(password, hash);

    if (!passwordMatchWithHash) {
      throw new Error(); // TODO
    }

    return true;
  }
}
