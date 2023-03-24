import { prisma } from '@src/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  const user = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: '123456',
  }

  await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      password_hash: await hash(user.password, 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  await request(app.server).post('/users').send(user)

  const authResponse = await request(app.server).post('/sessions').send({
    email: user.email,
    password: user.password,
  })

  const { token } = authResponse.body

  return { token, user }
}
