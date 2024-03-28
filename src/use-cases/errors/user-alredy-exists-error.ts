export class UserAlredyExists extends Error {
  constructor() {
    super("E-amil already exists");
  }
}
