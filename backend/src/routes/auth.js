export default async function (app) {
  const { login } = await import('../services/matrix.js');

  app.post('/login', async (request, reply) => {
    const { username, password } = request.body || {};
    if (!username || !password) {
      return reply.code(400).send({ error: 'Username and password required' });
    }

    try {
      const data = await login(username, password);
      const token = app.jwt.sign({
        user_id: data.user_id,
        access_token: data.access_token,
        device_id: data.device_id,
      });
      return { token, user_id: data.user_id };
    } catch (err) {
      return reply.code(401).send({ error: err.error || 'Login failed' });
    }
  });
}
