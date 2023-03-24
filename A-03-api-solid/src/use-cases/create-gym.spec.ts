import { InMemoryGymsRepository } from '@src/repository/in-memory/in-memory-gym-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(inMemoryGymsRepository)
  })

  it('should be able to register', async () => {
    const { gym } = await sut.execute({
      name: 'John Doe Gym',
      description: 'gym anything',
      phone: '9182389123',
      latitude: -7.780472,
      longitude: -39.934559,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
