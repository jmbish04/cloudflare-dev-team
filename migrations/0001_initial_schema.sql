-- migrations/0001_initial_schema.sql

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning' NOT NULL, -- 'planning', 'development', 'deployed'
  a2a_base_url TEXT,                        -- Apps Script A2A endpoint for this project
  a2a_token TEXT,                           -- Encrypted auth token
  r2_bucket TEXT NOT NULL,
  github_repo_url TEXT,
  google_docs_folder_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                       -- 'prd', 'tad', 'ux_design', 'spec'
  title TEXT NOT NULL,
  google_doc_id TEXT UNIQUE,
  google_doc_url TEXT,
  r2_key TEXT,                              -- Path to canonical artifact in R2
  status TEXT DEFAULT 'draft' NOT NULL,
  version INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  document_id TEXT REFERENCES documents(id) ON DELETE SET NULL,
  parent_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,                                -- 'frontend', 'backend', 'database', etc.
  status TEXT NOT NULL DEFAULT 'todo',      -- 'todo', 'in_progress', 'review', 'done'
  priority INTEGER DEFAULT 3,               -- 1=high, 5=low
  dependencies TEXT,                        -- JSON array of task IDs
  github_pr_url TEXT,
  assignee_agent TEXT,                      -- 'frontend_agent', 'backend_agent', etc.
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agent_runs (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
  agent_type TEXT NOT NULL,
  activity_type TEXT NOT NULL,              -- 'code_generation', 'doc_analysis', 'code_review'
  status TEXT NOT NULL,                     -- 'queued', 'running', 'succeeded', 'failed'
  input_summary TEXT,
  output_summary TEXT,
  error_message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);

CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_status ON documents(status);

CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee_agent ON tasks(assignee_agent);
CREATE INDEX idx_tasks_parent_id ON tasks(parent_id);

CREATE INDEX idx_agent_runs_project_id ON agent_runs(project_id);
CREATE INDEX idx_agent_runs_task_id ON agent_runs(task_id);
CREATE INDEX idx_agent_runs_status ON agent_runs(status);
CREATE INDEX idx_agent_runs_agent_type ON agent_runs(agent_type);