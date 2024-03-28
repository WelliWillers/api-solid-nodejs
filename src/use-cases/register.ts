import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";
import { UserAlredyExists } from "./errors/user-alredy-exists-error";

interface RegisterUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      throw new UserAlredyExists();
    }

    const password_hash = await hash(password, 6);

    await this.usersRepository.create({ name, email, password_hash });
  }
}
