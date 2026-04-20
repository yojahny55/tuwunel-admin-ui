export default async function (app) {
  const { matrixRequest, sendAdminCommand } = await import('../services/matrix.js');
  const ADMIN_ROOM_ID = process.env.MATRIX_ADMIN_ROOM_ID;

  const getToken = (request) => request.user.access_token;

  // Execute admin command via admin room
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

  // List users (admin command)
  app.post('/users/list', { preHandler: [app.authenticate] }, async (request, reply) => {
    if (!ADMIN_ROOM_ID) return reply.code(500).send({ error: 'ADMIN_ROOM_ID not configured' });
    try {
      const result = await sendAdminCommand(getToken(request), ADMIN_ROOM_ID, '!admin users list');
      return { success: true, event_id: result.event_id };
    } catch (err) {
      return reply.code(500).send({ error: err.error || 'Failed' });
    }
  });

  // Create user
  app.post('/users/create', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { username, password } = request.body || {};
    if (!username || !password) return reply.code(400).send({ error: 'Username and password required' });
    if (!ADMIN_ROOM_ID) return reply.code(500).send({ error: 'ADMIN_ROOM_ID not configured' });

    try {
      const result = await sendAdminCommand(
        getToken(request), ADMIN_ROOM_ID,
        `!admin users create ${username} ${password}`
      );
      return { success: true, event_id: result.event_id };
    } catch (err) {
      return reply.code(500).send({ error: err.error || 'Failed' });
    }
  });

  // Deactivate user
  app.post('/users/:userId/deactivate', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { userId } = request.params;
    if (!ADMIN_ROOM_ID) return reply.code(500).send({ error: 'ADMIN_ROOM_ID not configured' });

    try {
      const result = await sendAdminCommand(
        getToken(request), ADMIN_ROOM_ID,
        `!admin users deactivate ${userId}`
      );
      return { success: true, event_id: result.event_id };
    } catch (err) {
      return reply.code(500).send({ error: err.error || 'Failed' });
    }
  });

  // Reset password
  app.post('/users/:userId/reset-password', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { userId } = request.params;
    const { password } = request.body || {};
    if (!password) return reply.code(400).send({ error: 'Password required' });
    if (!ADMIN_ROOM_ID) return reply.code(500).send({ error: 'ADMIN_ROOM_ID not configured' });

    try {
      const result = await sendAdminCommand(
        getToken(request), ADMIN_ROOM_ID,
        `!admin users password ${userId} ${password}`
      );
      return { success: true, event_id: result.event_id };
    } catch (err) {
      return reply.code(500).send({ error: err.error || 'Failed' });
    }
  });

  // Delete room
  app.post('/rooms/:roomId/delete', { preHandler: [app.authenticate] }, async (request, reply) => {
    const { roomId } = request.params;
    if (!ADMIN_ROOM_ID) return reply.code(500).send({ error: 'ADMIN_ROOM_ID not configured' });

    try {
      const result = await sendAdminCommand(
        getToken(request), ADMIN_ROOM_ID,
        `!admin rooms delete ${roomId}`
      );
      return { success: true, event_id: result.event_id };
    } catch (err) {
      return reply.code(500).send({ error: err.error || 'Failed' });
    }
  });
}
