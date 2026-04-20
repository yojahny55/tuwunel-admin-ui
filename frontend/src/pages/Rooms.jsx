import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

export default function Rooms() {
  const { data: publicData, loading: publicLoading } = useApi(() => api.getRooms());
  const { data: joinedData, loading: joinedLoading, refetch } = useApi(() => api.getJoinedRooms());
  const [selected, setSelected] = useState(null);
  const [members, setMembers] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [inviteUserId, setInviteUserId] = useState('');
  const [inviting, setInviting] = useState(null);
  const [output, setOutput] = useState('');

  const showMembers = async (roomId) => {
    setSelected(roomId);
    try {
      const data = await api.getRoomMembers(roomId);
      setMembers(data.joined || {});
    } catch {
      setMembers(null);
    }
  };

  const handleDelete = async (roomId) => {
    if (!confirm(`Delete room ${roomId}? This sends an admin command.`)) return;
    setDeleting(roomId);
    try {
      await api.deleteRoom(roomId);
      refetch();
      setSelected(null);
      setMembers(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (publicLoading && joinedLoading) return <Spinner />;

  const publicRooms = publicData?.chunk || [];
  const joinedRooms = joinedData?.joined_rooms || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Rooms</h2>

      {/* Joined Rooms */}
      <Card title={`Joined Rooms (${joinedRooms.length})`}>
        {joinedRooms.length === 0 ? (
          <p className="text-gray-500 text-sm">No joined rooms.</p>
        ) : (
          <div className="space-y-2">
            {joinedRooms.map((roomId) => (
              <div key={roomId} className="flex items-center justify-between gap-4 py-1 border-b border-gray-800 last:border-0">
                <p className="text-sm text-gray-300 font-mono truncate min-w-0 flex-1">{roomId}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => showMembers(roomId)} className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
                    Members
                  </button>
                  <button
                    onClick={() => handleDelete(roomId)}
                    disabled={deleting === roomId}
                    className="text-xs px-2 py-1 bg-red-900/50 hover:bg-red-800 text-red-300 rounded disabled:opacity-50"
                  >
                    {deleting === roomId ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Public Rooms */}
      {publicRooms.length > 0 && (
        <Card title={`Public Rooms (${publicRooms.length})`}>
          <div className="space-y-2">
            {publicRooms.map((room) => (
              <div key={room.room_id} className="flex items-center justify-between gap-4 py-1 border-b border-gray-800 last:border-0">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-white truncate">{room.name || room.room_id}</p>
                  {room.topic && <p className="text-xs text-gray-400 truncate">{room.topic}</p>}
                </div>
                <span className="text-sm text-gray-400 shrink-0">{room.joined_members || 0} members</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {selected && members && (
        <Card title={`Members`}>
          <p className="text-xs text-gray-500 font-mono mb-2">{selected}</p>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {Object.entries(members).map(([userId, info]) => (
              <div key={userId} className="flex items-center gap-2 py-1 text-sm">
                <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs">
                  {(info.display_name || userId)[0]?.toUpperCase()}
                </span>
                <span className="text-gray-300">{info.display_name || userId}</span>
              </div>
            ))}
            {Object.keys(members).length === 0 && <p className="text-gray-500 text-sm">No members found</p>}
          </div>

          {/* Invite user to room */}
          <div className="mt-4 pt-3 border-t border-gray-800">
            <label className="block text-xs text-gray-400 mb-1">Invite user to this room</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="@username:atreides.local"
                value={inviting === selected ? inviteUserId : ''}
                onChange={(e) => { setInviteUserId(e.target.value); setInviting(selected); }}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={async () => {
                  if (!inviteUserId) return;
                  try {
                    await api.inviteToRoom(selected, inviteUserId);
                    setOutput(`✅ Invited ${inviteUserId} to ${selected}`);
                    setInviteUserId('');
                    showMembers(selected); // refresh members
                  } catch (err) {
                    setOutput(`❌ ${err.message}`);
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-sm"
              >
                Invite
              </button>
            </div>
          </div>

          {output && <pre className="mt-2 text-sm text-gray-300 whitespace-pre-wrap font-mono">{output}</pre>}
          <button onClick={() => { setSelected(null); setMembers(null); setOutput(''); }} className="mt-2 text-xs text-gray-500 hover:text-gray-300">Close</button>
        </Card>
      )}
    </div>
  );
}
