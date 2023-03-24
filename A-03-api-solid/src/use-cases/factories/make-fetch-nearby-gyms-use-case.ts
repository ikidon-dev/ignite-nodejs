import { PrismaGymsRepository } from '@src/repository/prisma/prisma-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(
    prismaGymsRepository,
  )

  return fetchNearbyGymsUseCase
}
