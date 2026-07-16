import { URGENCY } from '../../utils/constants';

export default function UrgencyBadge({ score }) {
  const config = URGENCY[score] || { label: score || 'Unknown', cssClass: 'badge-low' };
  return (
    <span className={`badge ${config.cssClass}`}>
      {score === 'critical' && <span style={{ fontSize: 8 }}>●</span>}
      {config.label}
    </span>
  );
}
