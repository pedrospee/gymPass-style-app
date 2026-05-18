import { expect, describe, it, beforeEach }  from "vitest";
import { RegisterUseCase } from "./register.js";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js";


let userRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(userRepository)
    })
    it("should be able to register", async () => {
        // Test implementation
        const user = await sut.execute({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password123"
        });

        expect(user.id).toEqual(expect.any(String))
    });


    it("should hash user password upon registration", async () => {
        // Test implementation
        const user = await sut.execute({
            name: "John Doe",
            email: "john.doe@example.com",
            password: "password123"
        });

        const isPasswordCurrentlyHashed = await compare(
            "password123",
            user.password_hash
        )
        expect(isPasswordCurrentlyHashed).toBe(true)
    });

    it("should not be able to register with an existing email", async () => {
        // Test implementation        
        const email = "john.doe@example.com"

        await sut.execute({
            name: "John Doe",
            email,
            password: "password123"
        });

        await expect(() =>
            sut.execute({
                name: "Jane Doe",
                email,
                password: "password456"
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    });
});