import { useState } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../components/common/Navbar.jsx';
import { getReport } from '../services/api.js';
import UrgencyBadge from '../components/common/UrgencyBadge.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { RELIEF_ITEMS, DAMAGE_LEVEL } from '../utils/constants.js';
import { formatDateTime, formatConfidence, formatCoords } from '../utils/formatters.js';

export default function Status() {
  const [reportId, setReportId] = useState('');
  const [report, setReport]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!reportId.trim()) return;
    setLoading(true); setError(null); setReport(null);
    const res = await getReport(reportId.trim());
    setLoading(false);
    if (res.success) setReport(res.data);
    else setError(res.error || 'Report not found.');
  };

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="container" style={{ maxWidth: 640, padding: '40px 24px 80px' }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>Track Your Report</h1>
          <p className="text-muted" style={{ marginBottom: 32 }}>Enter your Report ID to check the current status and AI assessment.</p>

          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <input
              className="form-input"
              placeholder="Enter Report ID (UUID format)"
              value={reportId}
              onChange={e => setReportId(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flexShrink: 0 }}>
              {loading ? <span className="spinner spinner-sm" /> : <Search size={16} />}
              Search
            </button>
          </form>

          {error && (
            <div className="card" style={{ padding: '16px 20px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)' }}>
              <p style={{ color: 'var(--color-critical)', fontSize: 14 }}>{error}</p>
            </div>
          )}

          {report && (
            <div className="card animate-fade" style={{ padding: '28px' }}>
              <div className="flex justify-between items-center mb-4">
                <h2 style={{ fontSize: 18 }}>Report Details</h2>
                <StatusBadge status={report.status} />
              </div>

              <div className="divider" style={{ margin: '0 0 20px' }} />

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="form-label mb-2">Urgency</p>
                  <UrgencyBadge score={report.urgency_score} />
                </div>
                <div>
                  <p className="form-label mb-2">Damage Level</p>
                  <span style={{ color: DAMAGE_LEVEL[report.damage_level]?.color || 'inherit', fontWeight: 600, fontSize: 14 }}>
                    {DAMAGE_LEVEL[report.damage_level]?.label || report.damage_level}
                  </span>
                </div>
                <div>
                  <p className="form-label mb-2">Submitted</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{formatDateTime(report.created_at)}</p>
                </div>
                <div>
                  <p className="form-label mb-2">Location</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {report.address || formatCoords(report.lat, report.lng)}
                  </p>
                </div>
              </div>

              {report.relief_items_list?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p className="form-label mb-2">Relief Items Needed</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {report.relief_items_list.map(item => (
                      <span key={item} style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)', fontSize: 13 }}>
                        {RELIEF_ITEMS[item]?.emoji} {RELIEF_ITEMS[item]?.label || item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {report.ai_summary && (
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px 16px' }}>
                  <p className="form-label mb-2">AI Assessment</p>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-text-muted)' }}>{report.ai_summary}</p>
                </div>
              )}

              {report.assigned_team && (
                <p style={{ marginTop: 14, fontSize: 13 }}>
                  🚑 <strong>Assigned team:</strong> <span style={{ color: 'var(--color-aid-dispatched)' }}>{report.assigned_team}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
