# MERN Counter App

A beginner-friendly full-stack app built with MongoDB, Express, React (Vite) and Node.js.
Register, log in, and use a personal counter. Every click is saved as history.

## Features
- Register and log in (JWT tokens, passwords hashed with bcryptjs)
- Protected dashboard, only for logged-in users
- Counter with Increase, Decrease and Reset
- Every action saved to MongoDB (action, value after the action, date/time)
- History list, newest first
- Each user sees only their own counter and history
- Logout button, error messages and loading states, mobile-friendly layout

## Setup
1. Install Node.js 18+ and MongoDB (local) or create a free MongoDB Atlas database.
2. Backend:
   ```
   cd server
   cp .env.example .env     # then edit .env
   npm install
   npm run dev
   ```
3. Frontend (new terminal):
   ```
   cd client
   npm install
   npm run dev
   ```
4. Open http://localhost:5173

## API
| Method | Route | Protected | Purpose |
|---|---|---|---|
| POST | /api/auth/register | no | Create account |
| POST | /api/auth/login | no | Log in |
| GET | /api/counter | yes | Current value |
| POST | /api/counter/increase | yes | +1 |
| POST | /api/counter/decrease | yes | -1 |
| POST | /api/counter/reset | yes | Back to 0 |
| GET | /api/counter/history | yes | History, newest first |
