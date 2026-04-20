import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

export default function Status() {
  const { data: health, loading: hLoading, refetch: refetchHealth } = useApi(() => api.getHealth());
  const { data: info, loading: iLoading } = useApi(() => api.getServerInfo());

  if (hLoading || iLoading) return <Spinner />;

  const checks = [
    { label: 'Matrix Server', status: health?.status === 'healthy' ? 'ok' : 'error', detail: health?.code ? `HTTP ${health.code}` : health?.status },
    { label: 'Domain', status: 'ok', detail: info?.domain },
    { label: 'Server URL', status: 'ok', detail: info?.serverUrl },
    { label: 'Client API', status: info?.clientVersions ? 'ok' : 'warn', detail: info?.clientVersions?.versions?.join(', ') || 'No version info' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Server Status</h2>
        <button onClick={refetchHealth} className="text-sm px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-300">Refresh</button>
      </div>

      <div className="space-y-3">
        {checks.map(({ label, status, detail }) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${
                  status === 'ok' ? 'bg-green-500' : status === 'warn' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="font-medium">{label}</span>
              </div>
              <span className="text-sm text-gray-400 font-mono">{detail}</span>
            </div>
          </Card>
        ))}
      </div>

      {info?.versions?.server && (
        <Card title="Server Version">
          <p className="text-gray-300">{info.versions.server.name} <span className="text-gray-500">{info.versions.server.version}</span></p>
        </Card>
      )}
    </div>
  );
}
