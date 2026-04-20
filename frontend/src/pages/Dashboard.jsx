import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Spinner from '../components/Spinner';
import { Globe, DoorOpen, Users, Activity, Server, Wifi } from 'lucide-react';

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="bg-white/[0.02] border border-border-subtle rounded-lg p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${accent || 'bg-white/[0.04]'}`}>
          <Icon size={16} strokeWidth={1.8} className={accent ? 'text-white' : 'text-text-tertiary'} />
        </div>
        <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-text-quaternary">
          {label}
        </span>
      </div>
      <p className="text-2xl font-semibold text-text-primary tracking-[-0.02em]">
        {value ?? '—'}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const { data: info, loading: infoLoading } = useApi(() => api.getServerInfo());
  const { data: rooms } = useApi(() => api.getRooms());
  const { data: joinedRooms } = useApi(() => api.getJoinedRooms());
  const { data: health } = useApi(() => api.getHealth());

  if (infoLoading) return <Spinner />;

  const roomCount = joinedRooms?.joined_rooms?.length || rooms?.chunk?.length || 0;
  const totalMembers = rooms?.chunk?.reduce((sum, r) => sum + (r.joined_members || 0), 0) || 0;
  const isHealthy = health?.status === 'healthy';

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h2 className="text-display">Dashboard</h2>
        <p className="text-[14px] text-text-tertiary mt-1">Server overview at a glance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Globe} label="Domain" value={info?.domain || '—'} />
        <StatCard
          icon={Activity}
          label="Status"
          value={
            <span className="flex items-center gap-2 text-[14px]">
              <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-status-ok' : 'bg-status-error'}`} />
              <span className="capitalize">{health?.status || 'Unknown'}</span>
            </span>
          }
          accent={isHealthy ? 'bg-status-ok/20' : 'bg-status-error/20'}
        />
        <StatCard icon={DoorOpen} label="Rooms" value={roomCount} />
        <StatCard icon={Users} label="Members" value={totalMembers} />
      </div>

      {/* Server info */}
      <div className="bg-white/[0.02] border border-border-subtle rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Server size={14} strokeWidth={1.8} className="text-text-tertiary" />
          <h3 className="text-[13px] font-medium text-text-secondary">Server Details</h3>
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[13px]">
          <div>
            <dt className="text-text-quaternary">Server URL</dt>
            <dd className="text-text-primary font-mono mt-0.5">{info?.serverUrl || '—'}</dd>
          </div>
          {info?.versions?.server && (
            <div>
              <dt className="text-text-quaternary">Server</dt>
              <dd className="text-text-primary mt-0.5">
                {info.versions.server.name} <span className="text-text-quaternary">{info.versions.server.version}</span>
              </dd>
            </div>
          )}
          {info?.clientVersions?.versions && (
            <div>
              <dt className="text-text-quaternary">Client API</dt>
              <dd className="text-text-primary font-mono mt-0.5 text-[12px]">
                {info.clientVersions.versions.join(', ')}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Recent rooms */}
      {joinedRooms?.joined_rooms?.length > 0 && (
        <div className="bg-white/[0.02] border border-border-subtle rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Wifi size={14} strokeWidth={1.8} className="text-text-tertiary" />
            <h3 className="text-[13px] font-medium text-text-secondary">Recent Rooms</h3>
          </div>
          <div className="space-y-1">
            {joinedRooms.joined_rooms.slice(0, 5).map((roomId) => (
              <div
                key={roomId}
                className="flex items-center py-1.5 border-b border-white/[0.03] last:border-0"
              >
                <span className="text-[13px] text-text-secondary font-mono truncate">
                  {roomId}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
