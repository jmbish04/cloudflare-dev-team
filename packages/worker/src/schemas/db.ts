import { z } from 'zod'

export const projectSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  status: z.string(),
  a2a_base_url: z.string().url().optional(),
  a2a_token: z.string().optional(),
  r2_bucket: z.string(),
  github_repo_url: z.string().optional(),
  google_docs_folder_id: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
})

export type Project = z.infer<typeof projectSchema>
