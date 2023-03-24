import { Gym, Prisma } from '@prisma/client'
import { getDistanceBetweenCoordinates } from '@src/utils/get-distance-between-coordinates'
import { randomUUID } from 'crypto'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public database: Gym[] = []

  async findManyNearby(params: FindManyNearbyParams) {
    return this.database.filter((row) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: row.latitude.toNumber(),
          longitude: row.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }

  async searchMany(query: { name: string }, page: number) {
    return this.database
      .filter((row) => row.name.includes(query.name))
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
    }

    this.database.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym: Gym | undefined = this.database.find((row) => row.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
