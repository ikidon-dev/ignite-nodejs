import { Decimal } from '@prisma/client/runtime/library'
import { InMemoryCheckInsRepository } from '@src/repository/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@src/repository/in-memory/in-memory-gym-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumbersOfCheckInsError } from './errors/max-numbers-of-check-ins-error'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(inMemoryCheckInsRepository, inMemoryGymsRepository)

    await inMemoryGymsRepository.create({
      id: 'gym-01',
      name: 'Typescript Gym',
      description: 'The Gym',
      latitude: new Decimal(-7.780472),
      longitude: new Decimal(-39.934559),
      phone: '11991123344',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-01',
      userLatitude: -7.780472,
      userLongitude: -39.934559,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-01',
      userLatitude: -7.780472,
      userLongitude: -39.934559,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-01',
        userLatitude: -7.780472,
        userLongitude: -39.934559,
      }),
    ).rejects.toBeInstanceOf(MaxNumbersOfCheckInsError)
  })

  it('should not be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      userId: 'user-id',
      gymId: 'gym-01',
      userLatitude: -7.780472,
      userLongitude: -39.934559,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-id',
      gymId: 'gym-01',
      userLatitude: -7.780472,
      userLongitude: -39.934559,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    await inMemoryGymsRepository.create({
      id: 'gym-02',
      name: 'Javascript Gym',
      description: 'javascript gym',
      phone: '8181877487',
      latitude: new Decimal(-11.472718),
      longitude: new Decimal(-44.5568133),
    })

    await expect(() =>
      sut.execute({
        userId: 'user-id',
        gymId: 'gym-02',
        userLatitude: -7.780472,
        userLongitude: -39.934559,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
