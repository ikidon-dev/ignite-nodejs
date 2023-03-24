import { Gym } from '@prisma/client'
import { GymsRepository } from '@src/repository/gyms-repository'

interface SearchGymsUseCaseRequest {
  query: {
    name: string
  }
  page?: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page = 1,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany(
      { name: query.name },
      page,
    )

    return { gyms }
  }
}
