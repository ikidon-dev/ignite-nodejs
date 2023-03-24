import { PrismaGymsRepository } from '@src/repository/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export function makeCreateGymUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const createGymUseCase = new CreateGymUseCase(prismaGymsRepository)

  return createGymUseCase
}
