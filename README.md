# Tuwunel Admin UI

Admin panel for [Tuwunel](https://github.com/matrix-construct/tuwunel) Matrix homeserver.

![](https://img.shields.io/badge/React-18-blue) ![](https://img.shields.io/badge/Fastify-4-green) ![](https://img.shields.io/badge/Docker-ready-blue)

## Features

- **Dashboard** — Server info, room count, member count, health status
- **Room Management** — List public rooms, view members, delete rooms via admin commands
- **User Management** — Create, deactivate, reset password via admin room commands
- **Admin Console** — Send raw `!admin` commands directly to the Tuwunel admin room
- **Server Status** — Health checks and version info
- **Dark Theme** — Clean, modern UI with responsive mobile support

## Architecture

```
Browser → React (Vite) → Fastify API proxy → Tuwunel Matrix API
                                      ↘ Admin room commands
```

- **Backend** acts as a secure proxy — the frontend never talks to Matrix directly
- Auth uses JWT tokens issued after Matrix login
- Admin operations go through Tuwunel's admin room command system (not Synapse admin API)

## Quick Start

### Docker (recommended)

```bash
cp .env.example .env
# Edit .env with your Matrix server details
docker compose up -d
```

Open http://localhost:3001

### Development

```bash
cp .env.example .env
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Configuration

| Variable | Description | Default |
|---|---|---|
| `MATRIX_SERVER_URL` | Tuwunel server URL | `http://192.168.5.56:6167` |
| `MATRIX_DOMAIN` | Server domain | `atreides.local` |
| `MATRIX_ADMIN_ROOM_ID` | Admin room for `!admin` commands | Required for admin ops |
| `JWT_SECRET` | Secret for signing JWT tokens | Change in production |
| `PORT` | Backend port | `3001` |

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Fastify, JWT auth
- **Deploy:** Docker + docker-compose

## License

MIT
