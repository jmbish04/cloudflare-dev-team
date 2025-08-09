import { describe, it, expect } from 'vitest'
import route from './health'

describe('GET /health', () => {
  it('returns ok status', async () => {
    const res = await route.request('http://localhost/')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({ status: 'ok' })
  })
})
