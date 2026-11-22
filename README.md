# MERN Counter App

A beginner-friendly full-stack web app built with the **MERN stack** (MongoDB, Express.js, React, Node.js).
Users register, log in, and use their own personal counter. Every click is saved to the database as history.

---

## Features

- User registration and login with **JWT authentication**
- Passwords hashed with **bcryptjs** (never stored as plain text)
- Protected dashboard, only open to logged-in users
- Counter with **Increase**, **Decrease** and **Reset** buttons
- Every action saved to MongoDB: action type, counter value after the action, date and time
- History list shown **newest first**
- Each user sees only **their own** counter and history
- Logout button
- Error messages (wrong password, email already used) and loading states
- Responsive design that works on mobile

---

## Tech Stack

| Part | Technologies |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express.js, Mongoose, jsonwebtoken, bcryptjs, dotenv, cors |
| Database | MongoDB |
| Modules | ES modules everywhere (`import` / `export`) |

---

## Folder Structure

```
counter-app/
├── README.md
├── .gitignore
├── server/
│   ├── .env.example
│   ├── package.json
│   ├── server.js                  # App entry point
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Counter.js
│   │   └── History.js
│   ├── controllers/
│   │   ├── authController.js      # register, login
│   │   └── counterController.js   # counter actions, history
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── counterRoutes.js
│   └── middleware/
│       └── authMiddleware.js      # Checks the JWT token
└── client/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx               # Starts React
        ├── App.jsx                # Routes
        ├── api.js                 # Axios setup
        ├── index.css              # Tailwind import
        ├── context/
        │   └── AuthContext.jsx    # Login state
        ├── components/
        │   ├── ProtectedRoute.jsx
        │   ├── AuthCard.jsx
        │   ├── Navbar.jsx
        │   ├── CounterCard.jsx
        │   └── HistoryList.jsx
        └── pages/
            ├── Login.jsx
            ├── Register.jsx
            └── Dashboard.jsx
```

---

## Prerequisites

- [Node.js](https://nodejs.org) version 18 or newer
- MongoDB, either:
  - installed on your computer, or
  - a free [MongoDB Atlas](https://www.mongodb.com/atlas) database

---

## Installation and Running

### 1. Start the backend

```bash
cd server
cp .env.example .env        # Windows: copy .env.example .env
npm install
npm run dev
```

Open `.env` and set your values (see below). You should see:

```
MongoDB connected
Server running on http://localhost:5000
```

### 2. Start the frontend (in a new terminal)

```bash
cd client
npm install
npm run dev
```

### 3. Open the app

Go to **http://localhost:5173**, create an account, and start counting.

---

## Environment Variables

Create `server/.env` from `server/.env.example`:

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/counter-app` |
| `JWT_SECRET` | Long random text used to sign tokens. Keep it secret. | `my_super_long_random_secret` |
| `PORT` | Port for the backend server | `5000` |

> Never commit your `.env` file to Git. It is already listed in `.gitignore`.

If your backend runs on a different address, create `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

---

## Database Models

**User**

| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique, lowercase |
| password | String | hashed with bcryptjs |
| createdAt | Date | default: now |

**Counter**

| Field | Type | Notes |
|---|---|---|
| user | ObjectId (ref User) | one counter per user |
| value | Number | default: 0 |

**History**

| Field | Type | Notes |
|---|---|---|
| user | ObjectId (ref User) | owner of the record |
| action | String | `increase`, `decrease` or `reset` |
| value | Number | counter value after the action |
| createdAt | Date | default: now |

---

## API Reference

Base URL: `http://localhost:5000/api`

Protected routes need this header:

```
Authorization: Bearer <your_token>
```

| Method | Route | Protected | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Create an account |
| POST | `/auth/login` | No | Log in |
| GET | `/counter` | Yes | Get the current value |
| POST | `/counter/increase` | Yes | Add 1 and save history |
| POST | `/counter/decrease` | Yes | Subtract 1 and save history |
| POST | `/counter/reset` | Yes | Set to 0 and save history |
| GET | `/counter/history` | Yes | Get history, newest first |

### Examples

**POST /auth/register**

Request:
```json
{ "name": "Asha", "email": "asha@example.com", "password": "secret123" }
```
Response (201):
```json
{
  "token": "eyJhbGciOi...",
  "user": { "id": "665f...", "name": "Asha", "email": "asha@example.com" }
}
```

**POST /auth/login**

Request:
```json
{ "email": "asha@example.com", "password": "secret123" }
```
Response (200): same shape as register.

**POST /counter/increase**

Response (200):
```json
{
  "value": 1,
  "entry": {
    "_id": "6660...",
    "user": "665f...",
    "action": "increase",
    "value": 1,
    "createdAt": "2026-11-22T10:30:00.000Z"
  }
}
```

**GET /counter**

Response (200):
```json
{ "value": 1 }
```

### Error responses

| Status | Meaning | Example message |
|---|---|---|
| 400 | Missing or invalid input | `Please fill in all fields` |
| 401 | Not logged in, wrong password, or expired token | `Wrong email or password` |
| 409 | Email already registered | `This email is already registered` |
| 500 | Server problem | `Server error, please try again` |

---

## How Authentication Works

1. The user registers or logs in.
2. The server checks the details, then creates a **JWT token** that is valid for 7 days.
3. React saves the token in the browser (`localStorage`).
4. Axios adds the token to every request.
5. `authMiddleware.js` checks the token and finds the user. Without a valid token, the request is rejected with 401.
6. Every counter query uses `req.user._id`, so users can only reach their own data.
7. On logout, the token is removed from the browser.

---

## Troubleshooting

| Problem | What to try |
|---|---|
| `MongoDB connection failed` | Make sure MongoDB is running, or check that `MONGO_URI` is correct (for Atlas, allow your IP address). |
| `secretOrPrivateKey must have a value` | `JWT_SECRET` is missing in `server/.env`. |
| "Cannot reach the server" on the page | The backend is not running, or the port does not match. Check `PORT` and `VITE_API_URL`. |
| Changes to `.env` are ignored | Stop the server and run `npm run dev` again. |
| Logged out suddenly | The token expired (7 days) or `JWT_SECRET` changed. Log in again. |

---

## Ideas for Next Steps

- Set a minimum value of 0 for the counter
- Add pagination or a "clear history" button
- Add a "show password" toggle on the forms
- Deploy the backend (Render, Railway) and the frontend (Vercel, Netlify)
- Add tests for the API routes
