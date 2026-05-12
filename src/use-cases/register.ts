import { prisma } from "@/lib/prisma.js";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error.js";

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

export async function registerUseCase({
    name,
    email,
    password
}: RegisterUseCaseRequest) {
    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (userWithSameEmail) {
        throw new UserAlreadyExistsError()
    }

    const passwordHash = await hash(password, 6)

    await prisma.user.create({
        data: {
            name,
            email,
            password_hash: passwordHash,
        }
    })

}