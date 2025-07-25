import type { DatabaseService, Logger } from '../types';

export class D1DatabaseService implements DatabaseService {
  constructor(
    private db: D1Database,
    private logger: Logger
  ) {}

  async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    try {
      this.logger.debug('Executing database query', { sql, params });
      const result = await this.db.prepare(sql).bind(...(params || [])).all();
      
      if (!result.success) {
        throw new Error(`Database query failed: ${result.error}`);
      }
      
      return result.results as T[];
    } catch (error) {
      this.logger.error('Database query failed', { sql, params, error: (error as Error).message });
      throw error;
    }
  }

  async queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
    try {
      this.logger.debug('Executing database query (single)', { sql, params });
      const result = await this.db.prepare(sql).bind(...(params || [])).first();
      
      return result as T | null;
    } catch (error) {
      this.logger.error('Database query failed', { sql, params, error: (error as Error).message });
      throw error;
    }
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    try {
      this.logger.debug('Executing database command', { sql, params });
      const result = await this.db.prepare(sql).bind(...(params || [])).run();
      
      if (!result.success) {
        throw new Error(`Database command failed: ${result.error}`);
      }
    } catch (error) {
      this.logger.error('Database command failed', { sql, params, error: (error as Error).message });
      throw error;
    }
  }

  async healthCheck(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
    try {
      await this.query('SELECT 1 as health_check');
      return 'healthy';
    } catch (error) {
      this.logger.error('Database health check failed', { error: (error as Error).message });
      return 'unhealthy';
    }
  }
}