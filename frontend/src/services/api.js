const API_BASE = '/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('admin_token');
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login: (username, password) =>
    request('/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

  // Server
  getServerInfo: () => request('/server/info'),
  getHealth: () => request('/server/health'),
  whoami: () => request('/whoami'),

  // Rooms
  getRooms: () => request('/rooms'),
  getJoinedRooms: () => request('/rooms/joined'),
  getRoomMembers: (roomId) => request(`/rooms/${encodeURIComponent(roomId)}/members`),
  getRoomState: (roomId) => request(`/rooms/${encodeURIComponent(roomId)}/state`),
  leaveRoom: (roomId) => request(`/rooms/${encodeURIComponent(roomId)}/leave`, { method: 'POST' }),

  // Admin commands
  sendCommand: (command) => request('/command', { method: 'POST', body: JSON.stringify({ command }) }),
  createAdminUser: (username, password) =>
    request('/users/create', { method: 'POST', body: JSON.stringify({ username, password }) }),
  deactivateUser: (userId) =>
    request(`/users/${encodeURIComponent(userId)}/deactivate`, { method: 'POST' }),
  resetPassword: (userId, password) =>
    request(`/users/${encodeURIComponent(userId)}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  deleteRoom: (roomId) =>
    request(`/rooms/${encodeURIComponent(roomId)}/delete`, { method: 'POST' }),
  inviteToRoom: (roomId, userId) =>
    request(`/rooms/${encodeURIComponent(roomId)}/invite`, {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    }),
};
