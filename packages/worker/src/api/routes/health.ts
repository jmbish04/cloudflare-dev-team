import { Hono } from 'hono';
import type { RequestContext } from '../../types';
import { HealthResponseSchema } from '../../schemas/api';
import { D1DatabaseService } from '../../services/d1';
import { R2StorageService } from '../../services/r2';
import { CloudflareQueueService } from '../../services/queue';

const health = new Hono<{ Bindings: any; Variables: { ctx: RequestContext } }>();

health.get('/', async (c) => {
  const ctx = c.get('ctx');
  const { logger, env } = ctx;

  try {
    logger.info('Health check requested');

    // Create service instances for health checks
    const dbService = new D1DatabaseService(env.DB, logger);
    const storageService = new R2StorageService(env.R2, logger);
    const queueService = new CloudflareQueueService(env.TASK_QUEUE, logger);

    // Perform health checks
    const [databaseHealth, storageHealth, queueHealth] = await Promise.allSettled([
      dbService.healthCheck(),
      storageService.healthCheck(),
      queueService.healthCheck(),
    ]);

    const response = {
      status: 'healthy' as const,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: databaseHealth.status === 'fulfilled' ? databaseHealth.value : 'unhealthy',
        storage: storageHealth.status === 'fulfilled' ? storageHealth.value : 'unhealthy',
        queue: queueHealth.status === 'fulfilled' ? queueHealth.value : 'unhealthy',
      },
    };

    // Validate response with Zod
    const validatedResponse = HealthResponseSchema.parse(response);

    logger.info('Health check completed', { 
      services: validatedResponse.services 
    });

    return c.json(validatedResponse, 200);
  } catch (error) {
    logger.error('Health check failed', { error: (error as Error).message });
    
    return c.json({
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: 'Health check failed',
      },
      request_id: ctx.requestId,
    }, 500);
  }
});

export { health };