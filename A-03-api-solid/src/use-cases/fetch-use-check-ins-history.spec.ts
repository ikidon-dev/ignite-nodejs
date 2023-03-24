import { InMemoryCheckInsRepository } from '@src/repository/in-memory/in-memory-check-ins-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch Use Check-ins History Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(inMemoryCheckInsRepository)
  })

  it('should be able to fetch check-in history', async () => {
    await inMemoryCheckInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    await inMemoryCheckInsRepository.create({
      user_id: 'user-01',
      gym_id: 'gym-02',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ user_id: 'user-01', gym_id: 'gym-01' }),
      expect.objectContaining({ user_id: 'user-01', gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated user check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCheckInsRepository.create({
        user_id: 'user-01',
        gym_id: `gym-${i}`,
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ user_id: 'user-01', gym_id: 'gym-21' }),
      expect.objectContaining({ user_id: 'user-01', gym_id: 'gym-22' }),
    ])
  })
})
