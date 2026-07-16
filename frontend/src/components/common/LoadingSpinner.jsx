export function LoadingSpinner({ size = 'md', label = '' }) {
  return (
    <div className="flex flex-col items-center gap-3" style={{ justifyContent: 'center' }}>
      <div className={`spinner ${size === 'sm' ? 'spinner-sm' : ''}`} />
      {label && <p className="text-muted" style={{ fontSize: 14 }}>{label}</p>}
    </div>
  );
}

export function LoadingScreen({ label = 'Loading…' }) {
  return (
    <div className="loading-screen">
      <div className="spinner" />
      <p className="text-muted">{label}</p>
    </div>
  );
}
