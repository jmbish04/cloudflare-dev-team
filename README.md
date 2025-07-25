# MCP Orchestrator System

A comprehensive software development lifecycle management system built on Cloudflare Workers. This system manages the complete journey from initial idea to final deployment, coordinating multiple specialized AI agents and cloud services through a unified API accessible via MCP (Model Context Protocol) and standard HTTP.

## 🏗️ Architecture Overview

- **Primary Orchestrator**: Main Cloudflare Worker hosting the MCP server, HTTP API, and orchestration logic
- **Database**: Cloudflare D1 for persistence (projects, documents, tasks, agent activity logs)
- **File Storage**: Cloudflare R2 for storing generated code, documentation, and design assets
- **Async Processing**: Cloudflare Queues for long-running workflows
- **External Integrations**: Google Docs, GitHub, and multiple LLM providers

## 🚀 Current Status - Milestone 1 Complete

✅ **Repository Structure**: Complete monorepo with pnpm workspaces
✅ **Infrastructure Configuration**: `wrangler.toml` with D1, R2, and Queue bindings
✅ **Database Schema**: Complete D1 migration with all required tables
✅ **Type Safety**: Full Zod schemas for API, database, and MCP validation
✅ **OpenAPI Specification**: Complete API documentation
✅ **Basic Worker**: Health endpoint with service status checks
✅ **Development Scripts**: Migration and seeding utilities
✅ **CI/CD**: GitHub Actions for deployment and R2 sync

## 📁 Project Structure

```
/
├─ packages/
│  ├─ worker/                      # Main Cloudflare Worker
│  │  ├─ src/
│  │  │  ├─ index.ts               # Worker entrypoint
│  │  │  ├─ api/routes/            # HTTP API routes  
│  │  │  ├─ services/              # Core services (D1, R2, Queue)
│  │  │  ├─ schemas/               # Zod validation schemas
│  │  │  ├─ openapi/               # OpenAPI 3.1 specification
│  │  │  └─ types/                 # TypeScript type definitions
│  │  ├─ wrangler.toml             # Cloudflare configuration
│  │  └─ package.json
│  └─ shared/                      # Shared types and utilities
│     ├─ src/
│     │  ├─ types.ts               # Common type definitions
│     │  └─ prompts/               # LLM prompt templates
│     └─ package.json
├─ migrations/                     # D1 database migrations
├─ .github/workflows/              # CI/CD pipelines
├─ scripts/                        # Utility scripts
└─ package.json                    # Workspace configuration
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- Cloudflare account with Workers, D1, and R2 enabled

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cloudflare-dev-team

# Install dependencies
pnpm install

# Type check
pnpm run type-check

# Build shared packages
pnpm run build
```

### Database Setup

```bash
# Generate migration commands
pnpm run migrate

# Generate seed data commands  
pnpm run seed

# Apply migrations (requires wrangler setup)
wrangler d1 execute mcp-orchestrator-db --file=migrations/0001_initial_schema.sql

# Apply seed data
wrangler d1 execute mcp-orchestrator-db --command="<seed SQL>"
```

### Local Development

```bash
# Start development server
pnpm run dev

# The health endpoint will be available at:
# http://localhost:8787/health
```

## 📊 API Endpoints

### Health Check
- `GET /health` - Service health status
- `GET /` - API information

### Projects (Coming in M2)
- `GET /projects` - List projects
- `POST /projects` - Create project
- `GET /projects/{id}` - Get project details
- `PATCH /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

### Documents (Coming in M3)
- `GET /projects/{id}/documents` - List project documents
- `POST /projects/{id}/documents` - Create document

### Tasks (Coming in M4)
- `GET /projects/{id}/tasks` - List project tasks
- `POST /projects/{id}/tasks` - Create task

### Orchestrations (Coming in M3+)
- `POST /orchestrations/idea-to-docs` - Generate documents from idea
- `POST /orchestrations/doc-to-tasks` - Generate tasks from document
- `POST /ci/github/pull-from-r2` - Sync code from R2 to GitHub

## 🔧 Configuration

### Environment Variables
- `ENVIRONMENT`: Deployment environment (development/staging/production)
- `LOG_LEVEL`: Logging level (debug/info/warn/error)

### Cloudflare Resources Required
- **D1 Database**: `mcp-orchestrator-db`
- **R2 Bucket**: `mcp-orchestrator-storage`
- **Queue**: `mcp-orchestrator-tasks`

## 🧪 Testing

```bash
# Run all tests
pnpm run test

# Type checking
pnpm run type-check

# Linting
pnpm run lint
```

## 🚢 Deployment

### Staging
```bash
cd packages/worker
wrangler deploy --env staging
```

### Production
```bash
cd packages/worker
wrangler deploy --env production
```

### Automated Deployment
Push to `main` branch to trigger automatic deployment via GitHub Actions.

## 📋 Roadmap

### Milestone 2: Projects CRUD
- Complete project management API
- MCP tools for project operations
- Database integration

### Milestone 3: Document Generation
- Google Docs integration
- LLM-powered document generation
- Idea-to-docs orchestration

### Milestone 4: Task Management
- Task CRUD operations
- Document-to-tasks breakdown
- Task dependency management

### Milestone 5-10: Advanced Features
- R2 file storage integration
- GitHub synchronization
- Real LLM providers
- Queue processing
- Comprehensive testing
- Security hardening

## 🤝 Contributing

This project follows a milestone-based development approach. Each milestone builds upon the previous one to create a complete system for AI-assisted software development lifecycle management.

## 📄 License

MIT License - see LICENSE file for details.