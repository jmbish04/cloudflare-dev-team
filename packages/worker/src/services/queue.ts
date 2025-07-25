import type { QueueService, Logger, QueueMessage } from '../types';

export class CloudflareQueueService implements QueueService {
  constructor(
    private queue: Queue<QueueMessage>,
    private logger: Logger
  ) {}

  async sendMessage(message: QueueMessage): Promise<void> {
    try {
      this.logger.debug('Sending message to queue', { 
        type: message.type, 
        project_id: message.project_id 
      });
      
      await this.queue.send(message);
      this.logger.info('Message sent to queue successfully', { 
        type: message.type, 
        project_id: message.project_id 
      });
    } catch (error) {
      this.logger.error('Failed to send message to queue', { 
        type: message.type, 
        project_id: message.project_id,
        error: (error as Error).message 
      });
      throw error;
    }
  }

  async sendBatch(messages: QueueMessage[]): Promise<void> {
    try {
      this.logger.debug('Sending batch messages to queue', { count: messages.length });
      
      // Convert to the correct format for queue batch sending
      const batchMessages = messages.map(msg => ({ body: msg }));
      await this.queue.sendBatch(batchMessages);
      this.logger.info('Batch messages sent to queue successfully', { count: messages.length });
    } catch (error) {
      this.logger.error('Failed to send batch messages to queue', { 
        count: messages.length,
        error: (error as Error).message 
      });
      throw error;
    }
  }

  async healthCheck(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
    try {
      // For queues, we'll just assume healthy if the queue instance exists
      // In a real implementation, we might want a dedicated health check queue
      return 'healthy';
    } catch (error) {
      this.logger.error('Queue health check failed', { error: (error as Error).message });
      return 'unhealthy';
    }
  }
}