import { useState } from 'react';
import { api } from '../services/api';
import Card from '../components/Card';

export default function Users() {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');
  const [sending, setSending] = useState(false);

  // Create user form
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [creating, setCreating] = useState(false);

  const [deactivating, setDeactivating] = useState('');
  const [resetting, setResetting] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const runCommand = async () => {
    if (!command.trim()) return;
    setSending(true);
    setOutput('');
    try {
      const res = await api.sendCommand(command);
      setOutput(`✅ Sent (event: ${res.event_id})`);
    } catch (err) {
      setOutput(`❌ ${err.message}`);
    } finally {
      setSending(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await api.createAdminUser(newUser.username, newUser.password);
      setOutput(`✅ User created (event: ${res.event_id})`);
      setNewUser({ username: '', password: '' });
    } catch (err) {
      setOutput(`❌ ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDeactivate = async (userId) => {
    if (!confirm(`Deactivate ${userId}?`)) return;
    setDeactivating(userId);
    try {
      const res = await api.deactivateUser(userId);
      setOutput(`✅ Deactivation sent (event: ${res.event_id})`);
    } catch (err) {
      setOutput(`❌ ${err.message}`);
    } finally {
      setDeactivating('');
    }
  };

  const handleResetPassword = async (userId) => {
    if (!newPassword) return;
    setResetting(userId);
    try {
      const res = await api.resetPassword(userId, newPassword);
      setOutput(`✅ Password reset sent (event: ${res.event_id})`);
      setNewPassword('');
    } catch (err) {
      setOutput(`❌ ${err.message}`);
    } finally {
      setResetting('');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Users</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create User */}
        <Card title="Create User">
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Username — local part only (becomes <span className="text-indigo-400 font-mono">@username:atreides.local</span>)</label>
              <input
                type="text"
                placeholder="e.g. jessica"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              required
            />
            <button type="submit" disabled={creating} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm transition">
              {creating ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </Card>

        {/* Deactivate / Reset */}
        <Card title="Manage User">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="@user:atreides.local"
              id="manage-userid"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => handleResetPassword(document.getElementById('manage-userid')?.value)}
                disabled={!!resetting}
                className="bg-yellow-700 hover:bg-yellow-600 disabled:opacity-50 text-white rounded-lg px-3 py-2 text-sm"
              >
                {resetting ? '...' : 'Reset PW'}
              </button>
            </div>
            <button
              onClick={() => handleDeactivate(document.getElementById('manage-userid')?.value)}
              disabled={!!deactivating}
              className="bg-red-800 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm"
            >
              {deactivating ? '...' : 'Deactivate User'}
            </button>
          </div>
        </Card>
      </div>

      {/* Admin Command Console */}
      <Card title="Admin Command Console">
        <p className="text-xs text-gray-500 mb-3">Send raw commands to the Tuwunel admin room (e.g. <code className="text-indigo-400">!admin users list</code>)</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runCommand()}
            placeholder="!admin users list"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
          />
          <button onClick={runCommand} disabled={sending} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm">
            {sending ? '...' : 'Send'}
          </button>
        </div>
      </Card>

      {output && (
        <Card>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{output}</pre>
        </Card>
      )}
    </div>
  );
}
