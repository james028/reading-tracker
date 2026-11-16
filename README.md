# Reading Tracker

A full-stack application for tracking books and daily reading progress.

## Tech stack

- Backend: Fastify, TypeScript, PostgreSQL
- Database: PostgreSQL in Docker
- Frontend: SvelteKit (planned)
- API documentation: Swagger / OpenAPI

## Project structure

```text
client/  # Frontend application
server/  # Fastify backend
```

## Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Start PostgreSQL:

```bash
docker compose up -d
```

Run migrations:

```bash
cd server
npm run migrate
```

Run backend:

```bash
npm run dev
```

API documentation:

```text
http://localhost:3000/docs
```
