import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository.js"
import { RegisterUseCase } from "../register.js"

export function makeRegisterUseCase() {
    const userRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    return registerUseCase
}