import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository.js"
import { AuthenticateUseCase } from "../authenticate.js"

export function makeAuthenticateUseCase() {
    const userRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(userRepository)

    return authenticateUseCase
}