import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { hash } from "bcryptjs";
import { expect, describe, it, beforeEach }  from "vitest";
import { AuthenticateUseCase } from "./authenticate.js";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error.js";

let usersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })
    it("should be able to authenticate", async () => {
        // Test implementation
        await usersRepository.create({
            name: "John Doe",
            email: "john.doe@example.com",
            password_hash: await hash("password123", 8)
        })

        const { user } = await sut.execute({
            email: "john.doe@example.com",
            password: "password123"
        });

        expect(user.id).toEqual(expect.any(String))
    });

    it("should be able to should not be able to authenticate with wrong email", async () => {
        // Test implementation
        expect (() => sut.execute({
            email: "johndoe@example.com",
            password: "password123"
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    });

    it("should be able to should not be able to authenticate with wrong email", async () => {
        // Test implementation
        await usersRepository.create({
            name: "John Doe",
            email: "johndoe@example.com",
            password_hash: await hash("password123", 8)
        })

        expect (() => sut.execute({
            email: "johndoe@example.com",
            password: "password122"
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    });
});