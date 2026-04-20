import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

export default function Rooms() {
  const { data, loading, refetch } = useApi(() => api.getRooms());
  const [selected, setSelected] = useState(null);
  const [members, setMembers] = useState(null);
  const [deleting, setDeleting] = useState(null);

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

  if (loading) return <Spinner />;

  const rooms = data?.chunk || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Rooms</h2>
        <span className="text-sm text-gray-500">{rooms.length} public rooms</span>
      </div>

      <div className="space-y-2">
        {rooms.length === 0 && <p className="text-gray-500">No public rooms found.</p>}
        {rooms.map((room) => (
          <Card key={room.room_id} className="hover:border-gray-700 transition">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-white truncate">{room.name || room.room_id}</p>
                <p className="text-xs text-gray-500 font-mono truncate">{room.room_id}</p>
                {room.topic && <p className="text-sm text-gray-400 mt-1 truncate">{room.topic}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm text-gray-400">{room.joined_members || 0} members</span>
                <button onClick={() => showMembers(room.room_id)} className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">
                  Members
                </button>
                <button
                  onClick={() => handleDelete(room.room_id)}
                  disabled={deleting === room.room_id}
                  className="text-xs px-2 py-1 bg-red-900/50 hover:bg-red-800 text-red-300 rounded disabled:opacity-50"
                >
                  {deleting === room.room_id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selected && members && (
        <Card title={`Members of ${selected.slice(0, 30)}...`}>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {Object.entries(members).map(([userId, info]) => (
              <div key={userId} className="flex items-center gap-2 py-1 text-sm">
                <span className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs">
                  {(info.display_name || userId)[0]?.toUpperCase()}
                </span>
                <span className="text-gray-300">{info.display_name || userId}</span>
                <span className="text-gray-600 text-xs font-mono">{userId}</span>
              </div>
            ))}
            {Object.keys(members).length === 0 && <p className="text-gray-500 text-sm">No members found</p>}
          </div>
          <button onClick={() => { setSelected(null); setMembers(null); }} className="mt-2 text-xs text-gray-500 hover:text-gray-300">Close</button>
        </Card>
      )}
    </div>
  );
}
