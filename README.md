# 🧠 no-more-failures

#### Open-source RESTful API powering the no-more-failures ecosystem. Handles authentication, discipline management, study cycles, sessions, and performance analytics.

Designed for speed, scalability, and a clean, distraction-free learning experience.
💭 Feel free to contribute.

#### 🚀 Tech Stack

- Node.js / TypeScript
- Fastify – high-performance HTTP framework
- Prisma ORM
- PostgreSQL
- Zod – schema validation
- JWT – authentication
- Docker Compose – dev environment provisioning

| Entity       | Description                                                           |
| ------------ | --------------------------------------------------------------------- |
| User         | Represents registered users with auth and roles                       |
| Discipline   | Subjects being studied (e.g., Fundamentals of computing, Mathematics) |
| Topic        | Subtopics for each discipline (e.g., Computational arithmetic)        |
| Cycle        | Study plan distributing disciplines over time                         |
| StudySession | A tracked study block (start/stop times)                              |

#### 🔐 Authentication

- `POST /sessions`
- Protected routes require `Authorization: Bearer <token>`
- Role-based middleware for restricted operations

#### 🧮 Business Logic

- Performance calculation
  - Uses weighted averages (accuracy × consistency × total time studied);
- Session control
  - Sessions auto-close when exceeding maximum of five device sessions;

#### ⚙️ Environment Variables

Create a .env file in the backend root:

    PORT=3333
    DATABASE_URL="postgresql://user:password@localhost:5432/no_more_failures"
    JWT_SECRET="a-very-secure-secret"

#### 🐳 Docker Setup

    docker-compose up -d
    npm prisma migrate dev
    npm dev

#### 🧱 Code Guidelines

- All input validated with **Zod**
- Controllers are thin – I've tryed to make logic resides in use-cases
- No `any` types
- `decimal.js` for precise numeric operations

#### 🚀 Useful Commands

    npm install
    npx prisma migrate dev
    npx prisma studio
    npm run start:dev
    npm run build && npm run start
