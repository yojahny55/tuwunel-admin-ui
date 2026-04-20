import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import Spinner from '../components/Spinner';
import { Activity, RefreshCw, Server, Globe, Wifi, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

function StatusRow({ label, status, detail, icon: Icon }) {
  const colors = {
    ok: { dot: 'bg-status-ok', text: 'text-status-ok' },
    warn: { dot: 'bg-status-warn', text: 'text-status-warn' },
    error: { dot: 'bg-status-error', text: 'text-status-error' },
  };
  const c = colors[status] || colors.warn;

  return (
    <div className="flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-md bg-white/[0.04] flex items-center justify-center">
          <Icon size={14} strokeWidth={1.8} className="text-text-tertiary" />
        </div>
        <div>
          <p className="text-[13px] font-medium text-text-primary">{label}</p>
          {detail && <p className="text-[12px] text-text-quaternary font-mono mt-0.5">{detail}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
        <span className={`text-[12px] font-medium capitalize ${c.text}`}>
          {status === 'ok' ? 'Healthy' : status === 'error' ? 'Down' : 'Warning'}
        </span>
      </div>
    </div>
  );
}

export default function Status() {
  const { data: health, loading: hLoading, refetch: refetchHealth } = useApi(() => api.getHealth());
  const { data: info, loading: iLoading } = useApi(() => api.getServerInfo());

  if (hLoading || iLoading) return <Spinner />;

  const isHealthy = health?.status === 'healthy';

  const checks = [
    {
      label: 'Matrix Server',
      status: isHealthy ? 'ok' : 'error',
      detail: health?.code ? `HTTP ${health.code}` : health?.status,
      icon: Server,
    },
    {
      label: 'Domain',
      status: 'ok',
      detail: info?.domain,
      icon: Globe,
    },
    {
      label: 'Server URL',
      status: 'ok',
      detail: info?.serverUrl,
      icon: Wifi,
    },
    {
      label: 'Client API',
      status: info?.clientVersions ? 'ok' : 'warn',
      detail: info?.clientVersions?.versions?.join(', ') || 'No version info',
      icon: Activity,
    },
  ];

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-display">Server Status</h2>
          <p className="text-[14px] text-text-tertiary mt-1">Health checks and diagnostics</p>
        </div>
        <button
          onClick={refetchHealth}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] text-text-tertiary hover:text-text-secondary hover:bg-white/[0.04] transition-colors"
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Overall status banner */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
        isHealthy
          ? 'bg-status-ok/5 border-status-ok/20'
          : 'bg-status-error/5 border-status-error/20'
      }`}>
        {isHealthy ? (
          <CheckCircle size={18} className="text-status-ok shrink-0" />
        ) : (
          <AlertCircle size={18} className="text-status-error shrink-0" />
        )}
        <div>
          <p className={`text-[14px] font-medium ${isHealthy ? 'text-status-ok' : 'text-status-error'}`}>
            {isHealthy ? 'All systems operational' : 'Server issues detected'}
          </p>
          <p className="text-[12px] text-text-quaternary mt-0.5">
            Last checked just now
          </p>
        </div>
      </div>

      {/* Checks list */}
      <div className="bg-white/[0.02] border border-border-subtle rounded-lg overflow-hidden">
        <div className="divide-y divide-white/[0.03]">
          {checks.map((check) => (
            <StatusRow key={check.label} {...check} />
          ))}
        </div>
      </div>

      {/* Server version */}
      {info?.versions?.server && (
        <div className="bg-white/[0.02] border border-border-subtle rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Server size={13} strokeWidth={1.8} className="text-text-tertiary" />
            <span className="text-[12px] font-medium uppercase tracking-[0.04em] text-text-quaternary">
              Version
            </span>
          </div>
          <p className="text-[14px] text-text-primary">
            {info.versions.server.name}{' '}
            <span className="text-text-quaternary">{info.versions.server.version}</span>
          </p>
        </div>
      )}
    </div>
  );
}
