import UrgencyBadge from '../common/UrgencyBadge.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { timeAgo, truncate } from '../../utils/formatters.js';
import { MapPin } from 'lucide-react';

export default function PriorityQueue({ reports = [], selectedId, onSelect }) {
  const sorted = [...reports].sort((a, b) => {
    const order = { critical: 4, high: 3, medium: 2, low: 1 };
    return (order[b.urgency_score] || 0) - (order[a.urgency_score] || 0);
  });

  if (sorted.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-faint)', fontSize: 14 }}>
        No reports yet. Waiting for submissions…
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sorted.map(r => (
        <button
          key={r.id}
          onClick={() => onSelect(r)}
          style={{
            all: 'unset', cursor: 'pointer',
            display: 'block', width: '100%',
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${selectedId === r.id ? 'rgba(59,130,246,0.4)' : 'var(--color-border)'}`,
            background: selectedId === r.id ? 'rgba(59,130,246,0.06)' : 'var(--glass-bg)',
            transition: 'all 0.15s ease',
            textAlign: 'left',
          }}
          onMouseEnter={e => { if (selectedId !== r.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          onMouseLeave={e => { if (selectedId !== r.id) e.currentTarget.style.background = 'var(--glass-bg)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <UrgencyBadge score={r.urgency_score} />
            <span style={{ fontSize: 11, color: 'var(--color-text-faint)' }}>{timeAgo(r.created_at)}</span>
          </div>

          <p style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 8, color: 'var(--color-text-muted)' }}>
            {truncate(r.description, 90)}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-faint)' }}>
              <MapPin size={11} />
              {r.address ? truncate(r.address, 35) : `${r.lat?.toFixed(3)}, ${r.lng?.toFixed(3)}`}
            </div>
            <StatusBadge status={r.status} />
          </div>
        </button>
      ))}
    </div>
  );
}
