import { PrismaCheckInsRepository } from '@src/repository/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-ins'

export function makeValidateCheckInsUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const validateCheckInUseCase = new ValidateCheckInUseCase(
    prismaCheckInsRepository,
  )

  return validateCheckInUseCase
}
