import { useState } from 'react';
import { X, Download, Save } from 'lucide-react';
import UrgencyBadge from '../common/UrgencyBadge.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { RELIEF_ITEMS, DAMAGE_LEVEL, STATUS } from '../../utils/constants.js';
import { formatDateTime, formatConfidence, formatCoords } from '../../utils/formatters.js';
import { updateReportStatus, getReportPdfUrl } from '../../services/api.js';

const STATUS_OPTIONS = ['submitted', 'under_review', 'aid_dispatched', 'resolved'];

export default function ReportDetail({ report, onClose, onUpdated }) {
  const [status, setStatus]     = useState(report.status);
  const [team, setTeam]         = useState(report.assigned_team || '');
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const res = await updateReportStatus(report.id, status, team || undefined);
    setSaving(false);
    if (res.success) {
      setSaved(true);
      onUpdated?.({ ...report, status, assigned_team: team });
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="animate-slide" style={{
      position: 'fixed', top: 0, right: 0, bottom: 0,
      width: 420, background: 'var(--color-bg-secondary)',
      borderLeft: '1px solid var(--color-border)',
      display: 'flex', flexDirection: 'column',
      zIndex: 200, overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: 17 }}>Report Detail</h3>
        <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '6px' }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Badges */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <UrgencyBadge score={report.urgency_score} />
          <StatusBadge status={report.status} />
          {report.damage_level && (
            <span className="badge" style={{ color: DAMAGE_LEVEL[report.damage_level]?.color, background: `${DAMAGE_LEVEL[report.damage_level]?.color}18`, border: `1px solid ${DAMAGE_LEVEL[report.damage_level]?.color}44` }}>
              {DAMAGE_LEVEL[report.damage_level]?.label}
            </span>
          )}
        </div>

        {/* Meta */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <p className="form-label mb-1">Submitted</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{formatDateTime(report.created_at)}</p>
          </div>
          <div>
            <p className="form-label mb-1">Location</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              {report.address || formatCoords(report.lat, report.lng)}
            </p>
          </div>
          {report.reporter_name && (
            <div>
              <p className="form-label mb-1">Reporter</p>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{report.reporter_name}</p>
            </div>
          )}
          {report.confidence != null && (
            <div>
              <p className="form-label mb-1">AI Confidence</p>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{formatConfidence(report.confidence)}</p>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <p className="form-label mb-2">Description</p>
          <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--color-text-muted)' }}>{report.description}</p>
            {report.description_en && report.description_en !== report.description && (
              <>
                <hr style={{ borderColor: 'var(--color-border)', margin: '12px 0' }} />
                <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--color-text-muted)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>Translation: </span>
                  {report.description_en}
                </p>
              </>
            )}
          </div>
        </div>

        {/* AI Summary */}
        {report.ai_summary && (
          <div>
            <p className="form-label mb-2">🤖 AI Summary</p>
            <div style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '12px 14px' }}>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--color-text-muted)' }}>{report.ai_summary}</p>
            </div>
          </div>
        )}

        {/* Relief items */}
        {report.relief_items_list?.length > 0 && (
          <div>
            <p className="form-label mb-2">Relief Items Needed</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {report.relief_items_list.map(item => (
                <span key={item} style={{ padding: '5px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)', fontSize: 13 }}>
                  {RELIEF_ITEMS[item]?.emoji} {RELIEF_ITEMS[item]?.label || item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Status update */}
        <div style={{ background: 'var(--glass-bg)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '16px' }}>
          <p className="form-label mb-3">Update Status</p>
          <div className="form-group mb-3">
            <select
              className="form-input form-select"
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s} style={{ background: '#0d1526' }}>
                  {STATUS[s]?.icon} {STATUS[s]?.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-3">
            <input
              className="form-input"
              placeholder="Assign team (e.g. Team Alpha)"
              value={team}
              onChange={e => setTeam(e.target.value)}
            />
          </div>
          <button
            className="btn btn-primary w-full"
            onClick={handleSave}
            disabled={saving}
            style={{ justifyContent: 'center' }}
          >
            {saving ? <span className="spinner spinner-sm" /> : <Save size={15} />}
            {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {/* PDF */}
        <a
          href={getReportPdfUrl(report.id)}
          target="_blank"
          rel="noreferrer"
          className="btn btn-ghost w-full"
          style={{ justifyContent: 'center' }}
        >
          <Download size={15} /> Download PDF Report
        </a>
      </div>
    </div>
  );
}
