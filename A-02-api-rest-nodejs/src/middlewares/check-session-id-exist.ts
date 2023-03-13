import { FastifyReply, FastifyRequest } from 'fastify'

export function checkSessionIdExist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { sessionId } = request.cookies

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorizad.',
    })
  }
}
