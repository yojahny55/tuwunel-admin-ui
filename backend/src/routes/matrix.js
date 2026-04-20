export default async function (app) {
  const { matrixRequest, MATRIX_SERVER } = await import('../services/matrix.js');

  const getToken = (request) => request.user.access_token;

  // Server version / well-known
  app.get('/server/info', { preHandler: [app.authenticate] }, async (request) => {
    try {
      const [clientVersions] = await Promise.allSettled([
        matrixRequest('GET', '/_matrix/client/versions', getToken(request)),
      ]);
      return {
        domain: process.env.MATRIX_DOMAIN || 'atreides.local',
        serverUrl: MATRIX_SERVER,
        clientVersions: clientVersions.status === 'fulfilled' ? clientVersions.value : null,
      };
    } catch {
      return { domain: process.env.MATRIX_DOMAIN, serverUrl: MATRIX_SERVER };
    }
  });

  // Health check
  app.get('/server/health', { preHandler: [app.authenticate] }, async () => {
    try {
      const res = await fetch(`${MATRIX_SERVER}/_matrix/client/versions`);
      return { status: res.ok ? 'healthy' : 'unhealthy', code: res.status };
    } catch {
      return { status: 'unreachable' };
    }
  });

  // Public rooms
  app.get('/rooms', { preHandler: [app.authenticate] }, async (request) => {
    try {
      const data = await matrixRequest('GET', '/_matrix/client/v3/publicRooms', getToken(request));
      return data;
    } catch (err) {
      return { chunk: [], error: err.error || 'Failed to fetch rooms' };
    }
  });

  // Joined rooms
  app.get('/rooms/joined', { preHandler: [app.authenticate] }, async (request) => {
    try {
      const data = await matrixRequest('GET', '/_matrix/client/v3/joined_rooms', getToken(request));
      return data;
    } catch (err) {
      return { joined_rooms: [], error: err.error || 'Failed' };
    }
  });

  // Room members
  app.get('/rooms/:roomId/members', { preHandler: [app.authenticate] }, async (request) => {
    const { roomId } = request.params;
    try {
      const data = await matrixRequest(
        'GET',
        `/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/joined_members`,
        getToken(request)
      );
      return data;
    } catch (err) {
      return { joined: [], error: err.error || 'Failed' };
    }
  });

  // Room state
  app.get('/rooms/:roomId/state', { preHandler: [app.authenticate] }, async (request) => {
    const { roomId } = request.params;
    try {
      const data = await matrixRequest(
        'GET',
        `/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/state`,
        getToken(request)
      );
      return data;
    } catch (err) {
      return { error: err.error || 'Failed' };
    }
  });

  // Leave room
  app.post('/rooms/:roomId/leave', { preHandler: [app.authenticate] }, async (request) => {
    const { roomId } = request.params;
    try {
      await matrixRequest(
        'POST',
        `/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/leave`,
        getToken(request)
      );
      return { success: true };
    } catch (err) {
      return { error: err.error || 'Failed' };
    }
  });

  // User profile
  app.get('/users/:userId/profile', { preHandler: [app.authenticate] }, async (request) => {
    const { userId } = request.params;
    try {
      const data = await matrixRequest(
        'GET',
        `/_matrix/client/v3/profile/${encodeURIComponent(userId)}`,
        getToken(request)
      );
      return data;
    } catch (err) {
      return { error: err.error || 'Failed' };
    }
  });

  // Whoami
  app.get('/whoami', { preHandler: [app.authenticate] }, async (request) => {
    try {
      const data = await matrixRequest('GET', '/_matrix/client/v3/account/whoami', getToken(request));
      return data;
    } catch (err) {
      return { error: err.error || 'Failed' };
    }
  });
}
