# Home Portal

A lightweight web portal for managing home devices, users, and routines. Designed for extensibility, security, and easy deployment.

## Features
- User authentication and role-based access
- Device discovery and status dashboard
- Schedules & automation (routines)
- Notifications (email / push)
- REST API and optional WebSocket real-time updates
- Config-driven adapters for third-party integrations

## Requirements
- Node.js >= 18 (or specify backend runtime)
- PostgreSQL or SQLite (configurable)
- Optional: Redis for caching / pub-sub

## Quick start
1. Clone the repo
2. Install dependencies
    ```
    npm install
    ```
3. Create environment file `.env` (see Configuration)
4. Run migrations and seed (if applicable)
    ```
    npx prisma migrate deploy
    npx prisma db seed
    ```
5. Start dev server
    ```
    npm run dev
    ```

## Configuration
Create a `.env` with at least:
- PORT=3000
- DATABASE_URL=postgres://user:pass@localhost:5432/home_portal
- JWT_SECRET=your-strong-secret
- REDIS_URL=redis://localhost:6379 (optional)

## Architecture overview
- API server (REST + WebSocket) — stateless, authenticates with JWT
- Data layer — relational DB for persistent state
- Adapter layer — plugin interfaces for device types & integrations
- Frontend — SPA that consumes the API (separate repo or /client)

## Development
- Follow linting and formatting rules: `npm run lint`, `npm run format`
- Run tests: `npm test`
- Use feature branches and open pull requests with descriptive titles

## Contributing
- Open issues for bugs and feature requests
- Provide tests for new features
- Follow code of conduct

## License
Specify an open-source license (e.g., MIT). Update LICENSE file as needed.

For more details, see docs/ and the repository wiki.