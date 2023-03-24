import { PrismaCheckInsRepository } from '@src/repository/prisma/prisma-check-ins-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

export function makeGetUserMetricsUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const getUserMetricsUseCase = new GetUserMetricsUseCase(
    prismaCheckInsRepository,
  )

  return getUserMetricsUseCase
}
