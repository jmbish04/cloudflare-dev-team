import type { StorageService, Logger } from '../types';

export class R2StorageService implements StorageService {
  constructor(
    private r2: R2Bucket,
    private logger: Logger
  ) {}

  async uploadFile(key: string, content: string | ArrayBuffer, metadata?: Record<string, string>): Promise<void> {
    try {
      const size = typeof content === 'string' ? content.length : content.byteLength;
      this.logger.debug('Uploading file to R2', { key, size });
      
      const options: R2PutOptions = {};
      if (metadata) {
        options.customMetadata = metadata;
      }

      await this.r2.put(key, content, options);
      this.logger.info('File uploaded successfully', { key });
    } catch (error) {
      this.logger.error('Failed to upload file', { key, error: (error as Error).message });
      throw error;
    }
  }

  async downloadFile(key: string): Promise<string | null> {
    try {
      this.logger.debug('Downloading file from R2', { key });
      const object = await this.r2.get(key);
      
      if (!object) {
        this.logger.debug('File not found', { key });
        return null;
      }

      const content = await object.text();
      this.logger.debug('File downloaded successfully', { key, size: content.length });
      return content;
    } catch (error) {
      this.logger.error('Failed to download file', { key, error: (error as Error).message });
      throw error;
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      this.logger.debug('Deleting file from R2', { key });
      await this.r2.delete(key);
      this.logger.info('File deleted successfully', { key });
    } catch (error) {
      this.logger.error('Failed to delete file', { key, error: (error as Error).message });
      throw error;
    }
  }

  async listFiles(prefix: string): Promise<string[]> {
    try {
      this.logger.debug('Listing files from R2', { prefix });
      const listing = await this.r2.list({ prefix });
      
      const keys = listing.objects.map(obj => obj.key);
      this.logger.debug('Files listed successfully', { prefix, count: keys.length });
      return keys;
    } catch (error) {
      this.logger.error('Failed to list files', { prefix, error: (error as Error).message });
      throw error;
    }
  }

  async healthCheck(): Promise<'healthy' | 'degraded' | 'unhealthy'> {
    try {
      // Try to list objects with a small limit to check connectivity
      await this.r2.list({ limit: 1 });
      return 'healthy';
    } catch (error) {
      this.logger.error('R2 health check failed', { error: (error as Error).message });
      return 'unhealthy';
    }
  }
}