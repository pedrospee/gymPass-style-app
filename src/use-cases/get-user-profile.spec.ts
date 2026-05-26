import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { hash } from "bcryptjs";
import { expect, describe, it, beforeEach }  from "vitest";
import { GetUserProfileUseCase } from "./get-user-profile.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get User Profile Use Case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(usersRepository)
    })
    it("should be able to get user profile", async () => {
        // Test implementation
        const createdUser = await usersRepository.create({
            name: "John Doe",
            email: "john.doe@example.com",
            password_hash: await hash("password123", 8)
        })

        const { user } = await sut.execute({
            userId: createdUser.id
        });

        expect(user.id).toEqual(expect.any(String))
    });

    it("should not be able to get user profile with invalid user ID", async () => {
        // Test implementation
        await expect(() => sut.execute({
            userId: "invalid-user-id"
        })).rejects.toBeInstanceOf(ResourceNotFoundError)
    });
});