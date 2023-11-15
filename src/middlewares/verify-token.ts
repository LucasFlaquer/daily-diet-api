import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import { verify } from 'jsonwebtoken'

export function verifyToken(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) {
  const { token } = request.cookies
  if (token === undefined) reply.status(401).send({ message: 'Unauthorized' })
  try {
    const decoded = verify(`${token}`, 'SUPER_SECRET')
    console.log(decoded)
    const { sub } = decoded
    if (!sub) throw new Error('Invalid Token')
    request.user = sub as string
  } catch (error) {
    reply.status(401).send({ message: 'Unauthorized' })
  }
  done()
}
