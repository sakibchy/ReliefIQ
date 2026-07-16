import { STATUS } from '../../utils/constants';
import { snakeToTitle } from '../../utils/formatters';

export default function StatusBadge({ status }) {
  const config = STATUS[status] || { label: snakeToTitle(status || 'unknown'), cssClass: 'badge-resolved', icon: '?' };
  return (
    <span className={`badge ${config.cssClass}`}>
      {config.icon} {config.label}
    </span>
  );
}
