#!/usr/bin/env tsx

import { readFileSync } from 'fs';
import { join } from 'path';

interface SeedConfig {
  database: string;
  environment?: string;
}

class DatabaseSeeder {
  private config: SeedConfig;

  constructor(config: SeedConfig) {
    this.config = config;
  }

  async seedDatabase(): Promise<void> {
    console.log('🌱 Starting database seeding...');
    
    try {
      // Generate seed data
      const seedData = this.generateSeedData();
      
      console.log(`🎯 Target database: ${this.config.database}`);
      console.log('');
      console.log('🚀 Run the following commands to seed the database:');
      console.log('');

      const env = this.config.environment ? ` --env ${this.config.environment}` : '';

      for (const sql of seedData) {
        console.log(`wrangler d1 execute ${this.config.database}${env} --command="${sql}"`);
      }

      console.log('');
      console.log('📝 Seed data SQL:');
      console.log('----------------------------------------');
      seedData.forEach((sql, index) => {
        console.log(`-- Seed ${index + 1}`);
        console.log(sql);
        console.log('');
      });
      console.log('----------------------------------------');

      console.log('✅ Seed data preparation completed!');
    } catch (error) {
      console.error('❌ Seeding failed:', error.message);
      process.exit(1);
    }
  }

  private generateSeedData(): string[] {
    const now = new Date().toISOString();
    
    return [
      // Sample project
      `INSERT INTO projects (id, name, slug, description, status, r2_bucket, created_at, updated_at) 
       VALUES (
         'proj_sample_001', 
         'Sample Project', 
         'sample-project', 
         'A sample project for testing the MCP Orchestrator system', 
         'planning', 
         'mcp-orchestrator-storage', 
         '${now}', 
         '${now}'
       );`,

      // Sample document
      `INSERT INTO documents (id, project_id, type, title, status, version, created_at, updated_at) 
       VALUES (
         'doc_sample_001', 
         'proj_sample_001', 
         'prd', 
         'Sample Product Requirements Document', 
         'draft', 
         1, 
         '${now}', 
         '${now}'
       );`,

      // Sample tasks
      `INSERT INTO tasks (id, project_id, document_id, title, description, type, status, priority, created_at, updated_at) 
       VALUES (
         'task_sample_001', 
         'proj_sample_001', 
         'doc_sample_001', 
         'Setup project infrastructure', 
         'Initialize the project with basic infrastructure components', 
         'devops', 
         'todo', 
         1, 
         '${now}', 
         '${now}'
       );`,

      `INSERT INTO tasks (id, project_id, parent_id, title, description, type, status, priority, created_at, updated_at) 
       VALUES (
         'task_sample_002', 
         'proj_sample_001', 
         'task_sample_001', 
         'Create database schema', 
         'Design and implement the database schema for the application', 
         'database', 
         'todo', 
         2, 
         '${now}', 
         '${now}'
       );`,

      `INSERT INTO tasks (id, project_id, title, description, type, status, priority, assignee_agent, created_at, updated_at) 
       VALUES (
         'task_sample_003', 
         'proj_sample_001', 
         'Build frontend components', 
         'Develop the main frontend components and user interface', 
         'frontend', 
         'todo', 
         3, 
         'frontend_agent', 
         '${now}', 
         '${now}'
       );`,

      // Sample agent run
      `INSERT INTO agent_runs (id, project_id, task_id, agent_type, activity_type, status, input_summary, created_at, updated_at) 
       VALUES (
         'run_sample_001', 
         'proj_sample_001', 
         'task_sample_001', 
         'planning_agent', 
         'doc_analysis', 
         'succeeded', 
         'Analyzed project requirements and generated task breakdown', 
         '${now}', 
         '${now}'
       );`,
    ];
  }
}

// Configuration
const config: SeedConfig = {
  database: 'mcp-orchestrator-db',
  environment: process.env.NODE_ENV === 'production' ? 'production' : undefined,
};

// Run seeding
const seeder = new DatabaseSeeder(config);
seeder.seedDatabase().catch(console.error);