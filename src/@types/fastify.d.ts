import 'fastify'
declare module 'fastify' {
  interface FastifyRequest {
    user?: string // Modify the type as per your user object structure
  }
}
