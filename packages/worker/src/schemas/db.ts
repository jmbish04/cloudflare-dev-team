import { z } from 'zod';

// Project schemas
export const ProjectStatusSchema = z.enum(['planning', 'development', 'deployed']);

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  status: ProjectStatusSchema,
  a2a_base_url: z.string().nullable(),
  a2a_token: z.string().nullable(),
  r2_bucket: z.string(),
  github_repo_url: z.string().nullable(),
  google_docs_folder_id: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateProjectSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  status: ProjectStatusSchema.optional(),
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

// Document schemas
export const DocumentTypeSchema = z.enum(['prd', 'tad', 'ux_design', 'spec']);
export const DocumentStatusSchema = z.enum(['draft', 'review', 'approved', 'published']);

export const DocumentSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  type: DocumentTypeSchema,
  title: z.string(),
  google_doc_id: z.string().nullable(),
  google_doc_url: z.string().nullable(),
  r2_key: z.string().nullable(),
  status: DocumentStatusSchema,
  version: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateDocumentSchema = z.object({
  project_id: z.string(),
  type: DocumentTypeSchema,
  title: z.string().min(1),
  google_doc_id: z.string().optional(),
  google_doc_url: z.string().optional(),
  r2_key: z.string().optional(),
  status: DocumentStatusSchema.optional(),
});

export const UpdateDocumentSchema = CreateDocumentSchema.partial().omit({ project_id: true });

// Task schemas
export const TaskTypeSchema = z.enum(['frontend', 'backend', 'database', 'devops', 'testing', 'documentation']);
export const TaskStatusSchema = z.enum(['todo', 'in_progress', 'review', 'done']);
export const TaskPrioritySchema = z.number().min(1).max(5);

export const TaskSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  document_id: z.string().nullable(),
  parent_id: z.string().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  type: TaskTypeSchema.nullable(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
dependencies: z.string().nullable().transform(val => val ? JSON.parse(val) : []), // JSON array of task IDs
  github_pr_url: z.string().nullable(),
  assignee_agent: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateTaskSchema = z.object({
  project_id: z.string(),
  document_id: z.string().optional(),
  parent_id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  type: TaskTypeSchema.optional(),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  dependencies: z.array(z.string()).optional(),
  assignee_agent: z.string().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().omit({ project_id: true });

// Agent Run schemas
export const AgentTypeSchema = z.enum(['planning_agent', 'frontend_agent', 'backend_agent', 'testing_agent', 'review_agent']);
export const ActivityTypeSchema = z.enum(['code_generation', 'doc_analysis', 'code_review', 'testing', 'deployment']);
export const AgentRunStatusSchema = z.enum(['queued', 'running', 'succeeded', 'failed']);

export const AgentRunSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  task_id: z.string().nullable(),
  agent_type: AgentTypeSchema,
  activity_type: ActivityTypeSchema,
  status: AgentRunStatusSchema,
  input_summary: z.string().nullable(),
  output_summary: z.string().nullable(),
  error_message: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CreateAgentRunSchema = z.object({
  project_id: z.string(),
  task_id: z.string().optional(),
  agent_type: AgentTypeSchema,
  activity_type: ActivityTypeSchema,
  input_summary: z.string().optional(),
});

// Type exports
export type Project = z.infer<typeof ProjectSchema>;
export type CreateProject = z.infer<typeof CreateProjectSchema>;
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;

export type Document = z.infer<typeof DocumentSchema>;
export type CreateDocument = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocument = z.infer<typeof UpdateDocumentSchema>;

export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;

export type AgentRun = z.infer<typeof AgentRunSchema>;
export type CreateAgentRun = z.infer<typeof CreateAgentRunSchema>;

export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;
export type DocumentType = z.infer<typeof DocumentTypeSchema>;
export type DocumentStatus = z.infer<typeof DocumentStatusSchema>;
export type TaskType = z.infer<typeof TaskTypeSchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type AgentType = z.infer<typeof AgentTypeSchema>;
export type ActivityType = z.infer<typeof ActivityTypeSchema>;
export type AgentRunStatus = z.infer<typeof AgentRunStatusSchema>;