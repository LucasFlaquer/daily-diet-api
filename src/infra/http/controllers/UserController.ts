import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUserUseCase } from '../../../use-cases/makers/make-create-user-use-case'

export class UserController {
  public async register(req: FastifyRequest, reply: FastifyReply) {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      password: z.string(),
    })
    const user = bodySchema.parse(req.body)
    const useCase = makeUserUseCase()
    await useCase.execute({
      email: user.email,
      name: user.name,
      password: user.password,
      phone: user.phone,
    })
    return reply.status(201).send()
  }
}
