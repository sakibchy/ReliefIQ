import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/common/Navbar.jsx';
import ReportForm from '../components/ReportForm/ReportForm.jsx';
import UrgencyBadge from '../components/common/UrgencyBadge.jsx';
import { RELIEF_ITEMS } from '../utils/constants.js';
import { formatConfidence } from '../utils/formatters.js';

export default function Submit() {
  const [result, setResult] = useState(null);  // AI result after submission
  const [error, setError]   = useState(null);

  const handleSuccess = (data) => {
    setResult(data);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleError = (msg) => {
    setError(msg);
    setResult(null);
  };

  return (
    <>
      <Navbar />
      <main className="page">
        <div className="container" style={{ maxWidth: 680, padding: '40px 24px 80px' }}>

          {/* Success result */}
          {result && (
            <div className="card animate-scale" style={{ padding: '32px', marginBottom: 32, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)' }}>
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle size={28} color="var(--color-low)" />
                <div>
                  <h2 style={{ fontSize: 22 }}>Report Submitted!</h2>
                  <p className="text-muted" style={{ fontSize: 13 }}>ID: <code style={{ color: 'var(--color-accent)' }}>{result.id}</code></p>
                </div>
              </div>

              <div className="divider" style={{ margin: '16px 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <p className="form-label mb-2">Urgency Level</p>
                  <UrgencyBadge score={result.urgency_score} />
                </div>
                <div>
                  <p className="form-label mb-2">Damage Level</p>
                  <span className="badge badge-high" style={{ textTransform: 'capitalize' }}>{result.damage_level}</span>
                </div>
              </div>

              {result.relief_items?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p className="form-label mb-2">Relief Items Recommended</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {result.relief_items.map(item => (
                      <span key={item} style={{
                        padding: '4px 12px', borderRadius: 99,
                        background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)',
                        fontSize: 13
                      }}>
                        {RELIEF_ITEMS[item]?.emoji} {RELIEF_ITEMS[item]?.label || item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.ai_summary && (
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px 16px' }}>
                  <p className="form-label mb-2">AI Summary</p>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-text-muted)' }}>{result.ai_summary}</p>
                </div>
              )}

              {result.confidence != null && (
                <p style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-faint)' }}>
                  AI Confidence: {formatConfidence(result.confidence)}
                </p>
              )}

              <button className="btn btn-ghost w-full mt-4" onClick={() => setResult(null)}>
                Submit Another Report
              </button>
            </div>
          )}

          {/* Error alert */}
          {error && (
            <div className="card animate-fade" style={{ padding: '16px 20px', marginBottom: 24, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.06)', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <AlertCircle size={20} color="var(--color-critical)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Submission Failed</p>
                <p className="text-muted" style={{ fontSize: 13 }}>{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          {!result && (
            <>
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, marginBottom: 8 }}>Submit Disaster Report</h1>
                <p className="text-muted">
                  Provide details about the affected area. Our AI will assess the damage and alert relief coordinators immediately.
                </p>
              </div>
              <ReportForm onSuccess={handleSuccess} onError={handleError} />
            </>
          )}
        </div>
      </main>
    </>
  );
}
