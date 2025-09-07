# Software Flow App

A full-stack application with React 19 frontend and Rust backend, featuring Meilisearch integration and Docker containerization.

## Stack

### Frontend
- **React 19** with TypeScript
- **Mantine** UI components
- **React Router** for navigation
- **React Query** for data fetching
- **Zod** for validation
- **Vite** for build tooling

### Backend
- **Rust** with Axum framework
- **Meilisearch** for search functionality
- **Docker** containerization
- RESTful API endpoints

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)
- Rust 1.75+ (for local development)

### Running with Docker Compose

1. Clone the repository:
```bash
git clone <repository-url>
cd software-flow-app
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Start all services:
```bash
docker-compose up --build
```

4. Access the applications:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Meilisearch: http://localhost:7700

## Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
cargo run
```

## API Endpoints

- `GET /` - API root
- `GET /health` - Health check
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user by ID
- `GET /api/search?q=query` - Search functionality

## Project Structure

```
software-flow-app/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   └── types/          # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── backend/                # Rust backend
│   ├── src/
│   │   ├── handlers/       # API handlers
│   │   ├── models/         # Data models
│   │   └── services/       # Business logic
│   ├── Dockerfile
│   └── Cargo.toml
├── docker-compose.yml      # Multi-service setup
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `MEILISEARCH_URL` - Meilisearch server URL
- `MEILISEARCH_KEY` - Meilisearch API key
- `PORT` - Backend server port

## Features

- ✅ React 19 with modern hooks
- ✅ Mantine UI components
- ✅ Form validation with Zod
- ✅ Data fetching with React Query
- ✅ Rust REST API
- ✅ Meilisearch integration
- ✅ Docker containerization
- ✅ CORS enabled
- ✅ TypeScript support

## License

MIT