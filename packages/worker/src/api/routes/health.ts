import { Hono } from 'hono'
import { z } from 'zod'

const healthSchema = z.object({ status: z.literal('ok') })

const route = new Hono()
route.get('/', c => {
  const body = { status: 'ok' } as const
  const parsed = healthSchema.parse(body)
  return c.json(parsed)
})

export default route
