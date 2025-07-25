import { z } from 'zod';

// MCP Tool input/output schemas
export const MCPToolResultSchema = z.object({
  content: z.array(z.object({
    type: z.literal('text'),
    text: z.string(),
  })),
  isError: z.boolean().optional(),
});

// Projects tool schemas
export const ProjectsCreateInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
});

export const ProjectsGetInputSchema = z.object({
  id: z.string(),
});

export const ProjectsListInputSchema = z.object({
  status: z.enum(['planning', 'development', 'deployed']).optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

export const ProjectsUpdateInputSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['planning', 'development', 'deployed']).optional(),
  github_repo_url: z.string().optional(),
  google_docs_folder_id: z.string().optional(),
});

// Documents tool schemas
export const DocsGenerateInputSchema = z.object({
  project_id: z.string(),
  idea: z.string().min(10),
  type: z.enum(['prd', 'tad', 'ux_design', 'spec']),
});

export const DocsExportToGoogleInputSchema = z.object({
  document_id: z.string(),
});

export const DocsImportFromGoogleInputSchema = z.object({
  project_id: z.string(),
  google_doc_id: z.string(),
});

export const DocsGetInputSchema = z.object({
  id: z.string(),
});

export const DocsListInputSchema = z.object({
  project_id: z.string(),
  type: z.enum(['prd', 'tad', 'ux_design', 'spec']).optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

// Tasks tool schemas
export const TasksBreakdownFromDocInputSchema = z.object({
  document_id: z.string(),
  strategy: z.enum(['simple', 'detailed', 'epic']).default('detailed'),
});

export const TasksCreateInputSchema = z.object({
  project_id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['frontend', 'backend', 'database', 'devops', 'testing', 'documentation']).optional(),
  parent_id: z.string().optional(),
  assignee_agent: z.string().optional(),
  priority: z.number().min(1).max(5).default(3),
});

export const TasksGetInputSchema = z.object({
  id: z.string(),
});

export const TasksListInputSchema = z.object({
  project_id: z.string(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
  assignee_agent: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
});

export const TasksUpdateInputSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).optional(),
  assignee_agent: z.string().optional(),
  priority: z.number().min(1).max(5).optional(),
});

export const TasksDeleteInputSchema = z.object({
  id: z.string(),
});

// Code tool schemas
export const CodeWriteToR2InputSchema = z.object({
  project_id: z.string(),
  ref: z.string().default('main'),
  files: z.array(z.object({
    path: z.string(),
    content: z.string(),
  })),
});

// GitHub tool schemas
export const GitHubSyncFromR2InputSchema = z.object({
  project_id: z.string(),
  ref: z.string().default('main'),
});

// Agents tool schemas
export const AgentsRunInputSchema = z.object({
  project_id: z.string(),
  kind: z.enum(['planning', 'frontend', 'backend', 'testing', 'review']),
  input: z.record(z.any()),
  task_id: z.string().optional(),
});

// MCP Server configuration
export const MCPServerInfoSchema = z.object({
  name: z.string(),
  version: z.string(),
  protocol_version: z.string(),
});

export const MCPToolDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  inputSchema: z.record(z.any()),
});

// Export types
export type MCPToolResult = z.infer<typeof MCPToolResultSchema>;

export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;
export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;

export type DocsGenerateInput = z.infer<typeof DocsGenerateInputSchema>;
export type DocsExportToGoogleInput = z.infer<typeof DocsExportToGoogleInputSchema>;
export type DocsImportFromGoogleInput = z.infer<typeof DocsImportFromGoogleInputSchema>;
export type DocsGetInput = z.infer<typeof DocsGetInputSchema>;
export type DocsListInput = z.infer<typeof DocsListInputSchema>;

export type TasksBreakdownFromDocInput = z.infer<typeof TasksBreakdownFromDocInputSchema>;
export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;
export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;
export type TasksListInput = z.infer<typeof TasksListInputSchema>;
export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;
export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;

export type CodeWriteToR2Input = z.infer<typeof CodeWriteToR2InputSchema>;
export type GitHubSyncFromR2Input = z.infer<typeof GitHubSyncFromR2InputSchema>;
export type AgentsRunInput = z.infer<typeof AgentsRunInputSchema>;

export type MCPServerInfo = z.infer<typeof MCPServerInfoSchema>;
export type MCPToolDefinition = z.infer<typeof MCPToolDefinitionSchema>;