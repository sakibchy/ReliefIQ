import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Bell } from 'lucide-react';
import Navbar from '../components/common/Navbar.jsx';
import StatsCards from '../components/Dashboard/StatsCards.jsx';
import PriorityQueue from '../components/Dashboard/PriorityQueue.jsx';
import ReportDetail from '../components/Dashboard/ReportDetail.jsx';
import DisasterMap from '../components/Map/DisasterMap.jsx';
import { LoadingScreen } from '../components/common/LoadingSpinner.jsx';
import { getDashboardStats, getMapData, listReports } from '../services/api.js';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { RELIEF_ITEMS } from '../utils/constants.js';

export default function Admin() {
  const navigate = useNavigate();
  const [stats, setStats]           = useState(null);
  const [mapFeatures, setMapFeatures] = useState([]);
  const [reports, setReports]       = useState([]);
  const [selectedReport, setSelected] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [notifications, setNotifs]  = useState([]);

  const fetchAll = useCallback(async () => {
    const [statsRes, mapRes, reportsRes] = await Promise.all([
      getDashboardStats(),
      getMapData(),
      listReports({ limit: 100 }),
    ]);

    if (statsRes.success === false && statsRes.error?.includes('401')) {
      navigate('/admin/login');
      return;
    }

    if (statsRes.success)   setStats(statsRes.data);
    if (mapRes.success)     setMapFeatures(mapRes.data.features || []);
    if (reportsRes.success) setReports(reportsRes.data.items || []);
    setLoading(false);
  }, [navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Real-time WebSocket updates
  useWebSocket(useCallback((msg) => {
    if (msg.event === 'new_report') {
      fetchAll();
      // Show escalation notification for critical
      if (msg.data.urgency_score === 'critical') {
        const id = Date.now();
        setNotifs(n => [...n, { id, text: '🚨 New CRITICAL report received!' }]);
        setTimeout(() => setNotifs(n => n.filter(x => x.id !== id)), 5000);
        // Browser notification
        if (Notification.permission === 'granted') {
          new Notification('ReliefIQ — Critical Report', { body: 'A new critical disaster report has been submitted.' });
        }
      }
    }
    if (msg.event === 'status_updated') fetchAll();
  }, [fetchAll]));

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') Notification.requestPermission();
  }, []);

  const handleMarkerClick = useCallback((reportId) => {
    const r = reports.find(x => x.id === reportId);
    if (r) setSelected(r);
  }, [reports]);

  const handleReportUpdated = useCallback((updated) => {
    setReports(prev => prev.map(r => r.id === updated.id ? { ...r, ...updated } : r));
    setSelected(updated);
  }, []);

  if (loading) return <LoadingScreen label="Loading dashboard…" />;

  return (
    <>
      <Navbar isAdmin />

      {/* Toast notifications */}
      <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifications.map(n => (
          <div key={n.id} className="animate-slide" style={{
            padding: '12px 18px', borderRadius: 10,
            background: 'var(--color-critical-bg)', border: '1px solid rgba(239,68,68,0.4)',
            color: 'var(--color-critical)', fontWeight: 600, fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <Bell size={16} /> {n.text}
          </div>
        ))}
      </div>

      <main className="page" style={{ paddingBottom: 40 }}>
        <div className="container" style={{ paddingTop: 32 }}>

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 style={{ fontSize: 28 }}>Dashboard</h1>
              <p className="text-muted" style={{ fontSize: 14 }}>Real-time disaster response overview</p>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={fetchAll}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="mb-6">
            <StatsCards stats={stats} />
          </div>

          {/* Top relief needed */}
          {stats?.top_relief_needed?.length > 0 && (
            <div className="card mb-6" style={{ padding: '16px 20px' }}>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Top Relief Needed
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {stats.top_relief_needed.map(item => (
                    <span key={item} style={{ padding: '4px 14px', borderRadius: 99, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)', fontSize: 13 }}>
                      {RELIEF_ITEMS[item]?.emoji} {RELIEF_ITEMS[item]?.label || item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Map + Queue */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, minHeight: 560 }}>

            {/* Map */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: 500 }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: 15 }}>🗺️ Affected Areas</h3>
              </div>
              <div style={{ height: 500 }}>
                <DisasterMap
                  features={mapFeatures}
                  onMarkerClick={handleMarkerClick}
                />
              </div>
            </div>

            {/* Priority queue */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
                <h3 style={{ fontSize: 15 }}>🔴 Priority Queue</h3>
                <p className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>{reports.length} reports · sorted by urgency</p>
              </div>
              <div style={{ padding: '12px', flex: 1, overflowY: 'auto' }}>
                <PriorityQueue
                  reports={reports}
                  selectedId={selectedReport?.id}
                  onSelect={setSelected}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Slide-in detail panel */}
      {selectedReport && (
        <ReportDetail
          report={selectedReport}
          onClose={() => setSelected(null)}
          onUpdated={handleReportUpdated}
        />
      )}
    </>
  );
}
