import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js';
import { hash } from 'bcryptjs';
import { expect, describe, it, beforeEach } from 'vitest';
import { AuthenticateUseCase } from '@/use-cases/authenticate.js';
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error.js';

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    });
    it('should be able to authenticate', async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password_hash: await hash('password123', 8)
        });

        const { user } = await sut.execute({
            email: 'john.doe@example.com',
            password: 'password123'
        });

        expect(user.id).toEqual(expect.any(String));
    });

    it("should be able to should not be able to authenticate with wrong email", async () => {
        await expect(() => sut.execute({
            email: 'johndoe@example.com',
            password: 'password123'
        })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it("should be able to should not be able to authenticate with wrong email", async () => {
        await usersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password_hash: await hash('password123', 8)
        });

        await expect(() => sut.execute({
            email: 'johndoe@example.com',
            password: 'password122'
        })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});
