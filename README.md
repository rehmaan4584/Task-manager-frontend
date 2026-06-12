# Task Studio Frontend

Modern, responsive frontend for a full-stack task manager with auth flows, reminder creation, and real-time reminder notifications.

## Live URL (deployed on AWS EC2)

| Service | URL |
|---------|-----|
| App | http://16.16.198.166:3000 |

**Backend API:** http://16.16.198.166:5000/api

## Why This Project

This frontend is built to demonstrate production-style React skills for portfolio and remote-role evaluation:
- clean UI architecture
- robust API integration
- real-time user feedback via Socket.IO
- clear error/loading states

## Tech Stack

- React 19
- React Router DOM 7
- Axios
- Socket.IO Client
- Tailwind CSS
- Vite
- ESLint

## Core Features

- User login and signup pages
- Auth token handling with API interceptor
- Task CRUD UI (create, read, edit, delete)
- Reminder date and time selection UX
- Real-time reminder toast notifications from backend sockets
- Loading, error, empty, and success states for better UX

## Project Structure

```txt
src/
  components/        # reusable UI pieces (e.g., reminder pickers)
  context/           # auth context
  pages/             # Login, Signup, Todo
  services/          # API clients for auth/tasks
  toast/             # toast provider + notifications
  App.jsx            # layout + socket connection setup
  main.jsx           # router + providers bootstrap
```

## Local Setup

### 1) Install dependencies

```bash
npm install
```

### 2) Start frontend

```bash
npm run dev
```

Default app URL:
- `http://localhost:3000`

## Backend Dependency

This frontend expects backend API at:
- `http://localhost:5000/api`

And socket server at:
- `http://localhost:5000`

If your backend runs on another host/port, update:
- `src/services/api.js`
- `src/App.jsx` (socket URL)

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run lint checks

## What I Learned Building This

- Managing auth-aware API requests with axios interceptors
- Keeping socket join/re-join behavior reliable after login and refresh
- Designing smooth stateful UX for async task workflows
- Structuring React project modules for maintainability and clarity
