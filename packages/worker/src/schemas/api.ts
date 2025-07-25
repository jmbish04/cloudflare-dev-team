import { z } from 'zod';

// Common API response schemas
export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
  request_id: z.string(),
});

export const SuccessResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    request_id: z.string(),
  });

export const PaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      pages: z.number(),
    }),
    request_id: z.string(),
  });

// Query parameter schemas
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const ProjectsQuerySchema = PaginationQuerySchema.extend({
  status: z.enum(['planning', 'development', 'deployed']).optional(),
  search: z.string().optional(),
});

export const TasksQuerySchema = PaginationQuerySchema.extend({
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
  type: z.enum(['frontend', 'backend', 'database', 'devops', 'testing', 'documentation']).optional(),
  assignee_agent: z.string().optional(),
});

export const DocumentsQuerySchema = PaginationQuerySchema.extend({
  type: z.enum(['prd', 'tad', 'ux_design', 'spec']).optional(),
  status: z.enum(['draft', 'review', 'approved', 'published']).optional(),
});

// Orchestration schemas
export const IdeaToDocsRequestSchema = z.object({
  project_id: z.string().optional(),
  idea: z.string().min(10),
  project_name: z.string().optional(),
  project_description: z.string().optional(),
  document_types: z.array(z.enum(['prd', 'tad', 'ux_design'])).default(['prd', 'tad']),
});

export const DocToTasksRequestSchema = z.object({
  document_id: z.string(),
  breakdown_strategy: z.enum(['simple', 'detailed', 'epic']).default('detailed'),
});

export const CodeToR2RequestSchema = z.object({
  project_id: z.string(),
  ref: z.string().default('main'),
  files: z.array(z.object({
    path: z.string(),
    content: z.string(),
  })),
});

export const GitHubSyncRequestSchema = z.object({
  project_id: z.string(),
  ref: z.string().default('main'),
  commit_message: z.string().optional(),
});

export const AgentRunRequestSchema = z.object({
  project_id: z.string(),
  kind: z.enum(['planning', 'frontend', 'backend', 'testing', 'review']),
  input: z.record(z.any()),
  task_id: z.string().optional(),
});

// Health check schema
export const HealthResponseSchema = z.object({
  status: z.literal('healthy'),
  timestamp: z.string(),
  version: z.string(),
  services: z.object({
    database: z.enum(['healthy', 'degraded', 'unhealthy']),
    storage: z.enum(['healthy', 'degraded', 'unhealthy']),
    queue: z.enum(['healthy', 'degraded', 'unhealthy']),
  }),
});

// Export types
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type SuccessResponse<T> = {
  data: T;
  request_id: string;
};
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  request_id: string;
};

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type ProjectsQuery = z.infer<typeof ProjectsQuerySchema>;
export type TasksQuery = z.infer<typeof TasksQuerySchema>;
export type DocumentsQuery = z.infer<typeof DocumentsQuerySchema>;

export type IdeaToDocsRequest = z.infer<typeof IdeaToDocsRequestSchema>;
export type DocToTasksRequest = z.infer<typeof DocToTasksRequestSchema>;
export type CodeToR2Request = z.infer<typeof CodeToR2RequestSchema>;
export type GitHubSyncRequest = z.infer<typeof GitHubSyncRequestSchema>;
export type AgentRunRequest = z.infer<typeof AgentRunRequestSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;