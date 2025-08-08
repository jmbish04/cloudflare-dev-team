import { Hono } from 'hono'
import { healthResponseSchema as healthSchema } from '../../schemas/api'

const route = new Hono()
route.get('/', c => {
  const body = { status: 'ok' } as const
  const parsed = healthSchema.parse(body)
  return c.json(parsed)
})

export default route
