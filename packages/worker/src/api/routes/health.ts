import { Hono } from 'hono'
import { healthResponseSchema as healthSchema, type HealthResponse } from '../../schemas/api'

const route = new Hono()
route.get('/', c => {
  const body: HealthResponse = { status: 'ok' }
  const parsed = healthSchema.parse(body)
  return c.json(parsed)
})

export default route
