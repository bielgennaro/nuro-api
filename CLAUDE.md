# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js API built with ElysiaJS framework, using Bun as the runtime. The project follows a modular architecture with proper separation of concerns.

## Commands

### Development
- `bun dev` - Start development server with hot reload
- `docker compose -f docker-compose.dev.yml up` - Start development services (PostgreSQL, Redis, MinIO)

### Code Quality
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Run ESLint with auto-fix

### Database
- `bunx prisma migrate dev` - Generate and apply new migration in development
- `bunx prisma migrate deploy` - Apply migrations in production
- `bunx prisma generate` - Generate Prisma client (automatically run after migrations)

### Production
- `bun start` - Start production server
- `docker compose up -d` - Run full production stack

## Architecture

### Core Structure
- **Entry Point**: `src/index.ts` - Handles server startup, graceful shutdown, and error handling
- **Server Configuration**: `src/server.ts` - ElysiaJS app setup with middleware plugins
- **Configuration**: `src/config.ts` - Environment variable management using env-var
- **Database**: `src/db/index.ts` - Prisma client export

### Services Layer
Located in `src/services/`:
- **Redis**: `redis.ts` - Redis client configuration with BullMQ support
- **S3**: `s3.ts` - AWS SDK S3 client for MinIO compatibility
- **Locks**: `locks.ts` - Distributed locking using Verrou (supports memory/Redis stores)

### Database
- **ORM**: Prisma with PostgreSQL
- **Generated Client**: Located in `src/generated/prisma/` (auto-generated, don't edit)
- **Schema**: `prisma/schema.prisma`

### Middleware Stack
The ElysiaJS server uses these plugins:
- Swagger documentation
- OAuth2 authentication
- Bearer token authentication
- CORS handling
- JWT with configurable secret
- Server timing headers

### Environment Configuration
Key environment variables (see `src/config.ts`):
- `DATABASE_URL` - PostgreSQL connection string (required)
- `JWT_SECRET` - JWT signing secret (required)
- `PORT` - Server port (default: 3000)
- `REDIS_HOST` - Redis host (default: localhost)
- `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` - S3/MinIO configuration
- `LOCK_STORE` - Lock storage backend: "memory" or "redis" (default: memory)

### Development Services
The `docker-compose.dev.yml` provides:
- PostgreSQL database on port 5432
- Redis on port 6379
- MinIO S3-compatible storage with web console on port 9001

## Code Style

- Uses Anthony Fu's ESLint config with customizations
- Double quotes for strings
- 2-space indentation
- Top-level await enabled
- Console statements allowed
- Process global usage allowed
