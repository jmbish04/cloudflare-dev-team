// Common types shared across packages
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectEntity extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  status: 'planning' | 'development' | 'deployed';
  r2_bucket: string;
  github_repo_url?: string;
  google_docs_folder_id?: string;
}

export interface DocumentEntity extends BaseEntity {
  project_id: string;
  type: 'prd' | 'tad' | 'ux_design' | 'spec';
  title: string;
  google_doc_id?: string;
  google_doc_url?: string;
  r2_key?: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  version: number;
}

export interface TaskEntity extends BaseEntity {
  project_id: string;
  document_id?: string;
  parent_id?: string;
  title: string;
  description?: string;
  type?: 'frontend' | 'backend' | 'database' | 'devops' | 'testing' | 'documentation';
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: number;
  dependencies?: string[];
  github_pr_url?: string;
  assignee_agent?: string;
}

export interface AgentRunEntity extends BaseEntity {
  project_id: string;
  task_id?: string;
  agent_type: string;
  activity_type: string;
  status: 'queued' | 'running' | 'succeeded' | 'failed';
  input_summary?: string;
  output_summary?: string;
  error_message?: string;
}

// Event types for inter-service communication
export interface BaseEvent {
  type: string;
  timestamp: string;
  source: string;
  project_id: string;
}

export interface ProjectCreatedEvent extends BaseEvent {
  type: 'project.created';
  data: {
    project: ProjectEntity;
  };
}

export interface DocumentGeneratedEvent extends BaseEvent {
  type: 'document.generated';
  data: {
    document: DocumentEntity;
    content_r2_key: string;
  };
}

export interface TasksCreatedEvent extends BaseEvent {
  type: 'tasks.created';
  data: {
    tasks: TaskEntity[];
    source_document_id: string;
  };
}

export type SystemEvent = ProjectCreatedEvent | DocumentGeneratedEvent | TasksCreatedEvent;

// Utility functions
export function generateId(): string {
  return crypto.randomUUID();
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatTimestamp(date: Date = new Date()): string {
  return date.toISOString();
}