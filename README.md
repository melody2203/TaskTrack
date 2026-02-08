# Team Task Management App

A simple but functional task management system for teams.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router.
- **Backend**: Node.js, Express, Sequelize (SQLite/PostgreSQL).
- **Auth**: JWT-based authentication.

## Getting Started

### Prerequisites
- Node.js installed.
- PostgreSQL database (or update `prisma/schema.prisma` to use `sqlite` for testing).

### Backend Setup
1. Navigate to the `backend` folder.
2. Install dependencies: `npm install`.
3. Create a `.env` file from `.env.example` and add your `DATABASE_URL` and `JWT_SECRET`.
4. Run Prisma migrations: `npx prisma migrate dev --name init`.
5. Start the server: `npm run dev`.

### Frontend Setup
1. Navigate to the `frontend` folder.
2. Install dependencies: `npm install`.
3. Start the application: `npm run dev`.

## User Roles
1. **Manager**: Can create, assign, and delete tasks. Can see progress of all tasks.
2. **Member**: Can see assigned tasks and update status (Pending, In Progress, Done). Highlighting for near-deadline or overdue tasks.
