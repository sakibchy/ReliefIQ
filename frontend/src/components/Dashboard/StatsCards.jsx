import { AlertOctagon, AlertTriangle, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';

const CARDS = [
  { key: 'critical',       label: 'Critical',      icon: AlertOctagon, color: 'var(--color-critical)', bg: 'var(--color-critical-bg)' },
  { key: 'high',           label: 'High',           icon: AlertTriangle, color: 'var(--color-high)',    bg: 'var(--color-high-bg)' },
  { key: 'total_reports',  label: 'Total Reports',  icon: Info,          color: 'var(--color-accent)',  bg: 'rgba(59,130,246,0.1)' },
  { key: 'pending',        label: 'Pending Aid',    icon: Clock,         color: 'var(--color-medium)',  bg: 'var(--color-medium-bg)' },
  { key: 'resolved',       label: 'Resolved',       icon: CheckCircle,   color: 'var(--color-low)',     bg: 'var(--color-low-bg)' },
  { key: 'medium',         label: 'Medium',         icon: AlertCircle,   color: 'var(--color-medium)',  bg: 'var(--color-medium-bg)' },
];

export default function StatsCards({ stats }) {
  if (!stats) return null;
  return (
    <div className="grid grid-cols-4 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
      {CARDS.map(({ key, label, icon: Icon, color, bg }) => (
        <div key={key} className="card stat-card animate-fade" style={{ borderColor: `${color}22` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="stat-value" style={{ color }}>{stats[key] ?? 0}</div>
              <div className="stat-label">{label}</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color={color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
