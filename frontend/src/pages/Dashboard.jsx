import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

export default function Dashboard() {
  const { data: info, loading: infoLoading } = useApi(() => api.getServerInfo());
  const { data: rooms, loading: roomsLoading } = useApi(() => api.getRooms());
  const { data: joinedRooms, loading: joinedLoading } = useApi(() => api.getJoinedRooms());
  const { data: health, error: healthError } = useApi(() => api.getHealth());

  if (infoLoading) return <Spinner />;

  const roomCount = joinedRooms?.joined_rooms?.length || rooms?.chunk?.length || 0;
  const totalMembers = rooms?.chunk?.reduce((sum, r) => sum + (r.joined_members || 0), 0) || 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Domain">
          <p className="text-xl font-semibold text-white">{info?.domain || '—'}</p>
        </Card>
        <Card title="Status">
          <p className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${health?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="capitalize">{health?.status || 'unknown'}</span>
          </p>
        </Card>
        <Card title="Public Rooms">
          <p className="text-xl font-semibold text-white">{roomCount}</p>
        </Card>
        <Card title="Total Members">
          <p className="text-xl font-semibold text-white">{totalMembers}</p>
        </Card>
      </div>

      <Card title="Server Info" className="mt-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <dt className="text-gray-500">Server URL</dt>
          <dd className="text-gray-300 font-mono">{info?.serverUrl}</dd>
          {info?.versions?.server && (
            <>
              <dt className="text-gray-500">Server</dt>
              <dd className="text-gray-300">{info.versions.server.name} {info.versions.server.version}</dd>
            </>
          )}
          {info?.clientVersions?.versions && (
            <>
              <dt className="text-gray-500">Client API Versions</dt>
              <dd className="text-gray-300">{info.clientVersions.versions.join(', ')}</dd>
            </>
          )}
        </dl>
      </Card>

      {joinedRooms?.joined_rooms?.length > 0 && (
        <Card title="Joined Rooms">
          <div className="space-y-2">
            {joinedRooms.joined_rooms.slice(0, 5).map((roomId) => (
              <div key={roomId} className="flex items-center py-1 border-b border-gray-800 last:border-0">
                <span className="text-sm text-gray-300 font-mono truncate">{roomId}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
