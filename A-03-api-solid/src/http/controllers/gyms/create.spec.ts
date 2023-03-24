import { app } from '@src/app'
import { createAndAuthenticateUser } from '@src/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const gym = {
      name: 'Javascript Gym',
      description: 'Some description.',
      phone: '87123456789',
      latitude: -7.780472,
      longitude: -39.934559,
    }

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(gym)

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      gym: expect.objectContaining({
        name: gym.name,
        description: gym.description,
      }),
    })
  })
})
