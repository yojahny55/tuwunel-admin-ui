# Tuwunel Admin UI

Admin panel for [Tuwunel](https://github.com/matrix-construct/tuwunel) Matrix homeserver.

![](https://img.shields.io/badge/React-18-blue) ![](https://img.shields.io/badge/Fastify-4-green) ![](https://img.shields.io/badge/Docker-ready-blue)

## Features

- **Dashboard** — Server info, room count, member count, health status
- **Room Management** — List joined rooms, view members, invite users, delete rooms
- **User Management** — Create users, invite & auto-join to rooms, deactivate, reset password
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
- User creation uses the Matrix registration API with a registration token
- Admin operations (deactivate, password reset) go through Tuwunel's admin room command system
- Room invites support auto-join (logs in as the invited user and joins the room)

## Quick Start

### Docker Compose (recommended)

```bash
git clone https://github.com/yojahny55/tuwunel-admin-ui.git
cd tuwunel-admin-ui
cp .env.example .env
# Edit .env with your Matrix server details
docker compose up -d
```

Open http://localhost:3002

### Manual / Development

```bash
git clone https://github.com/yojahny55/tuwunel-admin-ui.git
cd tuwunel-admin-ui
cp .env.example .env
# Edit .env with your Matrix server details
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3002

## Configuration

Copy `.env.example` to `.env` and fill in your details:

```env
# Your Tuwunel server URL (internal or external)
MATRIX_SERVER_URL=http://your-server:6167

# Your Matrix server domain
MATRIX_DOMAIN=example.local

# Registration token from your Tuwunel config (TUWUNEL_REGISTRATION_TOKEN)
# Required for creating new users
MATRIX_REGISTRATION_TOKEN=your-registration-token

# Admin room ID — find it by syncing or sending "!admin" in a DM with the server
# Required for: deactivate user, reset password, delete room, admin console
# Optional for: create user, invite, view rooms/members
MATRIX_ADMIN_ROOM_ID=!yourAdminRoomId:example.local

# Login credentials (used by the backend for admin operations)
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password

# JWT secret — generate a unique one: openssl rand -hex 32
JWT_SECRET=generate-a-unique-secret-here

# Server port
PORT=3002
```

| Variable | Description | Required |
|---|---|---|
| `MATRIX_SERVER_URL` | Tuwunel server URL (with port) | Yes |
| `MATRIX_DOMAIN` | Your Matrix server domain | Yes |
| `MATRIX_REGISTRATION_TOKEN` | Token for user registration | Yes (for user creation) |
| `MATRIX_ADMIN_ROOM_ID` | Room ID for `!admin` commands | Yes (for admin ops) |
| `ADMIN_USERNAME` | Admin user for backend operations | Yes |
| `ADMIN_PASSWORD` | Admin user password | Yes |
| `JWT_SECRET` | Secret for signing JWT tokens | Yes |
| `PORT` | Backend server port | No (default: 3002) |

## How It Works

### User Creation
Uses the Matrix Client-Server registration API (`/_matrix/client/v3/register`) with your configured registration token. No admin room needed.

### Room Invites & Auto-Join
1. Sends a standard Matrix invite to the room
2. If auto-join is enabled: logs in as the invited user (using their password) and joins the room
3. The invited user appears in the room immediately

### Admin Commands (deactivate, reset password, delete room)
Sends `!admin` commands to the configured admin room. These require:
- The logged-in user to be a Tuwunel admin (first registered user)
- The admin room to be properly set up

### Authentication
- Login uses Matrix credentials directly (no separate account)
- Backend issues a JWT token for session management
- All API calls are proxied through the backend

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6
- **Backend:** Node.js, Fastify, JWT auth
- **Deploy:** Docker + docker-compose

## Tuwunel Setup

Make sure your Tuwunel server has:

```toml
# tuwunel config (environment variables also work)
server_name = "example.local"
allow_registration = true
registration_token = "your-registration-token"
```

Or via Docker environment variables:

```yaml
environment:
  TUWUNEL_SERVER_NAME: example.local
  TUWUNEL_ALLOW_REGISTRATION: "true"
  TUWUNEL_REGISTRATION_TOKEN: your-registration-token
```

## License

MIT
