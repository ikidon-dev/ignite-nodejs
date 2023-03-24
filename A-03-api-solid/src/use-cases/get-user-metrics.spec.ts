import { InMemoryCheckInsRepository } from '@src/repository/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetUserMetricsUseCase } from './get-user-metrics'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(inMemoryCheckInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await inMemoryCheckInsRepository.create({
      user_id: 'user-1',
      gym_id: 'user-1',
    })

    await inMemoryCheckInsRepository.create({
      user_id: 'user-1',
      gym_id: 'user-2',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-1',
    })

    expect(checkInsCount).toEqual(2)
  })
})
