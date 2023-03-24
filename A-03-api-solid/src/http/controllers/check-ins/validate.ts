import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInsUseCase } from '@src/use-cases/factories/validate-check-ins-use-case'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const validateCheckInsUseCase = makeValidateCheckInsUseCase()

  const { checkIn } = await validateCheckInsUseCase.execute({
    checkInId,
  })

  return reply.status(200).send({ checkIn })
}
