import { matrixRequest, sendAdminCommand } from '../services/matrix.js';

const MATRIX_SERVER = process.env.MATRIX_SERVER_URL || 'http://192.168.5.56:6167';
const REGISTRATION_TOKEN = process.env.MATRIX_REGISTRATION_TOKEN;
const ADMIN_ROOM_ID = process.env.MATRIX_ADMIN_ROOM_ID;

export default async function (app) {
  const getToken = (request) => request.user.access_token;

  // Execute admin command via admin room (raw console)
  app.post('/command', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { command } = request.body || {};
    if (!command) return reply.code(400).send({ error: 'Command required' });
    if (!ADMIN_ROOM_ID) return reply.code(500).send({ error: 'ADMIN_ROOM_ID not configured' });

    try {
      const result = await sendAdminCommand(getToken(request), ADMIN_ROOM_ID, command);
      return { success: true, event_id: result.event_id };
    } catch (err) {
      return reply.code(500).send({ error: err.error || 'Command failed' });
    }
  });

  // Create user via Matrix registration API
  app.post('/users/create', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { username, password } = request.body || {};
    if (!username || !password) return reply.code(400).send({ error: 'Username and password required' });

    try {
      const res = await fetch(`${MATRIX_SERVER}/_matrix/client/v3/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'user',
          auth: { type: 'm.login.registration_token', token: REGISTRATION_TOKEN },
          username,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) return reply.code(res.status).send({ error: data.error || data.errcode || 'Registration failed' });
      return { success: true, user_id: data.user_id };
    } catch (err) {
      return reply.code(500).send({ error: err.message || 'Failed' });
    }
  });

  // Deactivate user via admin room command
  app.post('/users/:userId/deactivate', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { userId } = request.params;
    if (!ADMIN_ROOM_ID) return reply.code(500).send({ error: 'ADMIN_ROOM_ID not configured — deactivate requires admin room' });

    try {
      const result = await sendAdminCommand(getToken(request), ADMIN_ROOM_ID, `!admin users deactivate ${userId}`);
      return { success: true, event_id: result.event_id };
    } catch (err) {
      return reply.code(500).send({ error: err.error || 'Failed' });
    }
  });

  // Reset password via admin room command
  app.post('/users/:userId/reset-password', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { userId } = request.params;
    const { password } = request.body || {};
    if (!password) return reply.code(400).send({ error: 'Password required' });
    if (!ADMIN_ROOM_ID) return reply.code(500).send({ error: 'ADMIN_ROOM_ID not configured — password reset requires admin room' });

    try {
      const result = await sendAdminCommand(getToken(request), ADMIN_ROOM_ID, `!admin users password ${userId} ${password}`);
      return { success: true, event_id: result.event_id };
    } catch (err) {
      return reply.code(500).send({ error: err.error || 'Failed' });
    }
  });

  // Delete room via admin room command
  app.post('/rooms/:roomId/delete', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { roomId } = request.params;
    if (!ADMIN_ROOM_ID) return reply.code(500).send({ error: 'ADMIN_ROOM_ID not configured' });

    try {
      const result = await sendAdminCommand(getToken(request), ADMIN_ROOM_ID, `!admin rooms delete ${roomId}`);
      return { success: true, event_id: result.event_id };
    } catch (err) {
      return reply.code(500).send({ error: err.error || 'Failed' });
    }
  });
}
