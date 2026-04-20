const MATRIX_SERVER = process.env.MATRIX_SERVER_URL || 'http://192.168.5.56:6167';

export async function matrixRequest(method, endpoint, token, body = null) {
  const url = `${MATRIX_SERVER}${endpoint}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, ...data };
  }
  return data;
}

export async function sendAdminCommand(token, roomId, command) {
  const txnId = `admin_${Date.now()}`;
  return matrixRequest(
    'PUT',
    `/_matrix/client/v3/rooms/${encodeURIComponent(roomId)}/send/m.room.message/${txnId}`,
    token,
    { msgtype: 'm.text', body: command }
  );
}

export async function login(username, password) {
  const url = `${MATRIX_SERVER}/_matrix/client/v3/login`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'm.login.password',
      identifier: { type: 'm.id.user', user: username },
      password,
    }),
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, ...data };
  return data;
}

export { MATRIX_SERVER };
