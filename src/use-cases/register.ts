import type { UsersRepository } from '@/repositories/users-repository.js';
import type { User } from '@/generated/prisma/client.js';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error.js';



interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}
interface RegisterUseCaseResponse {
    user: User;
}
export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) {}


    async execute({
        name,
        email,
        password,
    }: RegisterUseCaseRequest) {
        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }

        const password_hash = await hash(password, 6);

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        });
        return user;
    }
}
