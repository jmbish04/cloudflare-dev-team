import type { ExecutionContext } from '@cloudflare/workers-types';

// Cloudflare Workers environment bindings
export interface Env {
  // D1 Database
  DB: D1Database;
  
  // R2 Storage
  R2: R2Bucket;
  
  // Queues
  TASK_QUEUE: Queue<QueueMessage>;
  
  // Environment variables
  ENVIRONMENT: string;
  LOG_LEVEL: string;
  
  // Secrets (will be added in later milestones)
  GITHUB_TOKEN?: string;
  GOOGLE_SERVICE_ACCOUNT_KEY?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
}

// Queue message types
export interface QueueMessage {
  type: 'idea_to_docs' | 'doc_to_tasks' | 'agent_run' | 'sync_to_github';
  data: any;
  project_id: string;
  retry_count?: number;
}

// Service interfaces
export interface Logger {
  info(message: string, meta?: Record<string, any>): void;
  warn(message: string, meta?: Record<string, any>): void;
  error(message: string, meta?: Record<string, any>): void;
  debug(message: string, meta?: Record<string, any>): void;
}

export interface DatabaseService {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  queryOne<T = any>(sql: string, params?: any[]): Promise<T | null>;
  execute(sql: string, params?: any[]): Promise<void>;
}

export interface StorageService {
  uploadFile(key: string, content: string | ArrayBuffer, metadata?: Record<string, string>): Promise<void>;
  downloadFile(key: string): Promise<string | null>;
  deleteFile(key: string): Promise<void>;
  listFiles(prefix: string): Promise<string[]>;
}

export interface QueueService {
  sendMessage(message: QueueMessage): Promise<void>;
  sendBatch(messages: QueueMessage[]): Promise<void>;
}

export interface LLMProvider {
  name: string;
  generateText(prompt: string, options?: LLMOptions): Promise<string>;
  generateStructured<T>(prompt: string, schema: any, options?: LLMOptions): Promise<T>;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

// Request context for dependency injection
export interface RequestContext {
  env: Env;
  ctx: {
    waitUntil(promise: Promise<any>): void;
    passThroughOnException(): void;
  };
  requestId: string;
  logger: Logger;
  db: DatabaseService;
  storage: StorageService;
  queue: QueueService;
}

// API Error types
export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public meta?: Record<string, any>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class ValidationError extends APIError {
  constructor(message: string, public issues?: any[]) {
    super('VALIDATION_ERROR', message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends APIError {
  constructor(resource: string, id?: string) {
    super('NOT_FOUND', `${resource}${id ? ` with id ${id}` : ''} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends APIError {
  constructor(message: string = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string = 'Forbidden') {
    super('FORBIDDEN', message, 403);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends APIError {
  constructor(message: string) {
    super('CONFLICT', message, 409);
    this.name = 'ConflictError';
  }
}

// Utility types
export type UUID = string;
export type Timestamp = string;

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}