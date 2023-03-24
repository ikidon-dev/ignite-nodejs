import { app } from '@src/app'
import { createAndAuthenticateUser } from '@src/utils/test/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Nearby Gyms Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const javascriptGym = {
      name: 'Javascript Gym',
      description: 'Some description.',
      phone: '87123456789',
      latitude: -7.780472,
      longitude: -39.934559,
    }

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(javascriptGym)

    const typescriptGym = {
      name: 'Typescript Gym',
      description: 'Some description.',
      phone: '87123456789',
      latitude: -27.0610928,
      longitude: -49.5229501,
    }

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send(typescriptGym)

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: javascriptGym.latitude,
        longitude: javascriptGym.longitude,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.status).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ name: javascriptGym.name }),
    ])
  })
})
