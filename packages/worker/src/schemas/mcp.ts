import { z } from 'zod'

export const agentRunSchema = z.object({
  projectId: z.string(),
  kind: z.string(),
  input: z.any()
})

export type AgentRun = z.infer<typeof agentRunSchema>
