import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import type { Env, RequestContext } from './types';
import { createLogger } from './services/logger';
import { D1DatabaseService } from './services/d1';
import { R2StorageService } from './services/r2';
import { CloudflareQueueService } from './services/queue';
import { health } from './api/routes/health';

const app = new Hono<{ Bindings: Env & Record<string, any>; Variables: { ctx: RequestContext } }>();

// Global middleware
app.use('*', secureHeaders());
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://mcp-orchestrator.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['X-Request-ID'],
}));

// Request logging middleware
app.use('*', honoLogger());

// Request context middleware
app.use('*', async (c, next) => {
  const requestId = crypto.randomUUID();
  const env = c.env as Env;
  const logger = createLogger(requestId, env.LOG_LEVEL || 'info');

  // Create service instances
  const db = new D1DatabaseService(env.DB, logger);
  const storage = new R2StorageService(env.R2, logger);
  const queue = new CloudflareQueueService(env.TASK_QUEUE, logger);

  const ctx: RequestContext = {
    env,
    ctx: {
      waitUntil: c.executionCtx.waitUntil.bind(c.executionCtx),
      passThroughOnException: c.executionCtx.passThroughOnException.bind(c.executionCtx),
    },
    requestId,
    logger,
    db,
    storage,
    queue,
  };

  c.set('ctx', ctx);

  // Add request ID to response headers
  c.header('X-Request-ID', requestId);

  logger.info('Request started', {
    method: c.req.method,
    url: c.req.url,
    user_agent: c.req.header('User-Agent'),
  });

  const start = Date.now();
  await next();
  const duration = Date.now() - start;

  logger.info('Request completed', {
    method: c.req.method,
    url: c.req.url,
    status: c.res.status,
    duration_ms: duration,
  });
});

// Error handling middleware
app.onError((err, c) => {
  const ctx = c.get('ctx');
  if (ctx) {
    ctx.logger.error('Unhandled error', { 
      error: (err as Error).message, 
      stack: (err as Error).stack 
    });
  }

  return c.json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    },
    request_id: ctx?.requestId || 'unknown',
  }, 500);
});

// 404 handler
app.notFound((c) => {
  const ctx = c.get('ctx');
  ctx.logger.warn('Route not found', { 
    method: c.req.method, 
    url: c.req.url 
  });

  return c.json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
    request_id: ctx.requestId,
  }, 404);
});

// Routes
app.route('/health', health);

// API info endpoint
app.get('/', (c) => {
  const ctx = c.get('ctx');
  
  return c.json({
    name: 'MCP Orchestrator API',
    version: '1.0.0',
    description: 'A comprehensive software development lifecycle management system',
    docs: 'https://mcp-orchestrator.pages.dev/docs',
    health: '/health',
    environment: ctx.env.ENVIRONMENT,
    request_id: ctx.requestId,
  });
});

// Export the app
export default {
  fetch: app.fetch,
  
  // Queue consumer handler (for future use)
  async queue(batch: MessageBatch<any>, env: Env, ctx: ExecutionContext) {
    const logger = createLogger(crypto.randomUUID(), env.LOG_LEVEL || 'info');
    logger.info('Processing queue batch', { 
      queue: batch.queue, 
      messages: batch.messages.length 
    });

    for (const message of batch.messages) {
      try {
        logger.info('Processing queue message', { 
          type: message.body.type,
          project_id: message.body.project_id 
        });
        
        // TODO: Implement queue message processing in future milestones
        
        message.ack();
        logger.info('Queue message processed successfully');
      } catch (err) {
        logger.error('Failed to process queue message', { 
          error: (err as Error).message,
          message: message.body 
        });
        message.retry();
      }
    }
  },
};