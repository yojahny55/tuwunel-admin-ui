import { useState } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import {
  UserPlus,
  UserX,
  KeyRound,
  Terminal,
  Send,
  Search,
  RefreshCw,
  ChevronDown,
  AlertTriangle,
  Check,
} from 'lucide-react';

export default function Users() {
  // Create user
  const [showCreate, setShowCreate] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [creating, setCreating] = useState(false);

  // Manage user modal
  const [showManage, setShowManage] = useState(false);
  const [manageUserId, setManageUserId] = useState('');
  const [manageTab, setManageTab] = useState('password'); // 'password' | 'deactivate'
  const [resetPw, setResetPw] = useState('');
  const [resetting, setResetting] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  // Command console
  const [command, setCommand] = useState('');
  const [sending, setSending] = useState(false);

  // Feedback
  const [toast, setToast] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword) return;
    setCreating(true);
    try {
      const res = await api.createAdminUser(newUsername, newPassword);
      showToast(`User @${newUsername} created`);
      setNewUsername('');
      setNewPassword('');
      setShowCreate(false);
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setCreating(false);
    }
  };

  const openManage = (userId) => {
    setManageUserId(userId);
    setResetPw('');
    setConfirmDeactivate(false);
    setManageTab('password');
    setShowManage(true);
  };

  const handleResetPassword = async () => {
    if (!resetPw || !manageUserId) return;
    setResetting(true);
    try {
      await api.resetPassword(manageUserId, resetPw);
      showToast('Password updated');
      setResetPw('');
      setShowManage(false);
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setResetting(false);
    }
  };

  const handleDeactivate = async () => {
    if (!manageUserId) return;
    setDeactivating(true);
    try {
      await api.deactivateUser(manageUserId);
      showToast(`User ${manageUserId} deactivated`);
      setShowManage(false);
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setDeactivating(false);
    }
  };

  const runCommand = async () => {
    if (!command.trim()) return;
    setSending(true);
    try {
      const res = await api.sendCommand(command);
      showToast(`Command sent (${res.event_id?.slice(0, 12)}...)`);
      setCommand('');
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-display">Users</h2>
          <p className="text-[14px] text-text-tertiary mt-1">Manage accounts and access</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-brand hover:bg-brand-light text-white rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors"
        >
          <UserPlus size={14} />
          New User
        </button>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => { setManageUserId(''); setShowManage(true); }}
          className="flex items-center gap-3 bg-white/[0.02] border border-border-subtle rounded-lg p-4 hover:bg-white/[0.04] transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-md bg-status-warn/10 flex items-center justify-center">
            <KeyRound size={16} className="text-status-warn" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-text-primary">Reset Password</p>
            <p className="text-[12px] text-text-quaternary">Change a user's password</p>
          </div>
        </button>
        <button
          onClick={() => { setManageUserId(''); setManageTab('deactivate'); setShowManage(true); }}
          className="flex items-center gap-3 bg-white/[0.02] border border-border-subtle rounded-lg p-4 hover:bg-white/[0.04] transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-md bg-status-error/10 flex items-center justify-center">
            <UserX size={16} className="text-status-error" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-text-primary">Deactivate User</p>
            <p className="text-[12px] text-text-quaternary">Disable an account</p>
          </div>
        </button>
      </div>

      {/* Command Console */}
      <div className="bg-white/[0.02] border border-border-subtle rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Terminal size={13} strokeWidth={1.8} className="text-text-tertiary" />
          <h3 className="text-[12px] font-medium uppercase tracking-[0.04em] text-text-quaternary">
            Admin Console
          </h3>
        </div>
        <p className="text-[12px] text-text-quaternary mb-3">
          Send raw commands to the admin room — e.g. <code className="text-brand-light font-mono">!admin users list</code>
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runCommand()}
            placeholder="!admin users list"
            className="flex-1 bg-white/[0.03] border border-border-subtle rounded-md px-3 py-2 text-[13px] text-text-primary font-mono placeholder-text-quaternary focus-ring transition-colors"
          />
          <button
            onClick={runCommand}
            disabled={sending || !command.trim()}
            className="flex items-center gap-1.5 bg-white/[0.05] border border-border-subtle hover:bg-white/[0.08] disabled:opacity-40 text-text-secondary rounded-md px-3 py-2 text-[13px] transition-colors"
          >
            <Send size={13} />
            {sending ? 'Sending...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create User"
        subtitle="Add a new account to the server"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-text-tertiary mb-1.5">
              Username
            </label>
            <input
              type="text"
              placeholder="localpart"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full bg-white/[0.03] border border-border-subtle rounded-md px-3 py-2 text-[13px] text-text-primary placeholder-text-quaternary focus-ring transition-colors"
              required
              autoFocus
            />
            <p className="text-[11px] text-text-quaternary mt-1">
              Becomes <span className="text-brand-light font-mono">@{newUsername || 'username'}:your-server</span>
            </p>
          </div>
          <div>
            <label className="block text-[12px] font-medium text-text-tertiary mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="Choose a strong password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white/[0.03] border border-border-subtle rounded-md px-3 py-2 text-[13px] text-text-primary placeholder-text-quaternary focus-ring transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={creating}
            className="w-full bg-brand hover:bg-brand-light disabled:opacity-40 text-white rounded-md py-2 text-[13px] font-medium transition-colors"
          >
            {creating ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </Modal>

      {/* Manage User Modal */}
      <Modal
        open={showManage}
        onClose={() => { setShowManage(false); setConfirmDeactivate(false); }}
        title={manageTab === 'password' ? 'Reset Password' : 'Deactivate User'}
        subtitle={manageUserId || 'Enter a user ID below'}
      >
        <div className="space-y-4">
          {/* User ID input */}
          <div>
            <label className="block text-[12px] font-medium text-text-tertiary mb-1.5">
              User ID
            </label>
            <input
              type="text"
              placeholder="@user:server"
              value={manageUserId}
              onChange={(e) => setManageUserId(e.target.value)}
              className="w-full bg-white/[0.03] border border-border-subtle rounded-md px-3 py-2 text-[13px] text-text-primary font-mono placeholder-text-quaternary focus-ring transition-colors"
              autoFocus
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/[0.05]">
            {[
              { key: 'password', label: 'Password', icon: KeyRound },
              { key: 'deactivate', label: 'Deactivate', icon: UserX },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => { setManageTab(key); setConfirmDeactivate(false); }}
                className={`flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium border-b-2 transition-colors ${
                  manageTab === key
                    ? 'border-brand text-text-primary'
                    : 'border-transparent text-text-quaternary hover:text-text-tertiary'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>

          {/* Password tab */}
          {manageTab === 'password' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-text-tertiary mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={resetPw}
                  onChange={(e) => setResetPw(e.target.value)}
                  className="w-full bg-white/[0.03] border border-border-subtle rounded-md px-3 py-2 text-[13px] text-text-primary placeholder-text-quaternary focus-ring transition-colors"
                />
              </div>
              <button
                onClick={handleResetPassword}
                disabled={resetting || !resetPw || !manageUserId}
                className="w-full bg-brand hover:bg-brand-light disabled:opacity-40 text-white rounded-md py-2 text-[13px] font-medium transition-colors"
              >
                {resetting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}

          {/* Deactivate tab */}
          {manageTab === 'deactivate' && (
            <div className="space-y-3">
              {confirmDeactivate ? (
                <div className="bg-status-error/10 border border-status-error/20 rounded-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} className="text-status-error" />
                    <span className="text-[13px] text-status-error font-medium">This action is irreversible</span>
                  </div>
                  <p className="text-[12px] text-text-tertiary mb-3">
                    Deactivating <span className="font-mono text-text-secondary">{manageUserId}</span> will permanently disable the account.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDeactivate}
                      disabled={deactivating}
                      className="bg-status-error hover:bg-red-600 disabled:opacity-40 text-white rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors"
                    >
                      {deactivating ? 'Deactivating...' : 'Confirm Deactivation'}
                    </button>
                    <button
                      onClick={() => setConfirmDeactivate(false)}
                      className="text-[12px] text-text-tertiary hover:text-text-secondary px-3 py-1.5"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeactivate(true)}
                  disabled={!manageUserId}
                  className="w-full bg-status-error/10 hover:bg-status-error/20 disabled:opacity-40 text-status-error rounded-md py-2 text-[13px] font-medium transition-colors"
                >
                  Deactivate User
                </button>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-elevated text-[13px] font-medium transition-all ${
          toast.ok ? 'bg-status-ok/20 text-status-ok border border-status-ok/30' : 'bg-status-error/20 text-status-error border border-status-error/30'
        }`}>
          {toast.ok ? <Check size={14} /> : <AlertTriangle size={14} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
