import { InMemoryGymsRepository } from '@src/repository/in-memory/in-memory-gym-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(inMemoryGymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await inMemoryGymsRepository.create({
      name: 'gym-1',
      description: null,
      phone: null,
      latitude: -7.780472,
      longitude: -39.934559,
    })

    await inMemoryGymsRepository.create({
      name: 'gym-2',
      description: null,
      phone: null,
      latitude: -7.780472,
      longitude: -39.934559,
    })

    const { gyms } = await sut.execute({
      query: { name: 'gym-2' },
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ name: 'gym-2' })])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryGymsRepository.create({
        name: `gym-${i}`,
        description: null,
        phone: null,
        latitude: -7.780472,
        longitude: -39.934559,
      })
    }

    const { gyms } = await sut.execute({
      query: { name: 'gym' },
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'gym-21' }),
      expect.objectContaining({ name: 'gym-22' }),
    ])
  })
})
