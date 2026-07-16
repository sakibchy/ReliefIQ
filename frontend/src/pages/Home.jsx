import { Link } from 'react-router-dom';
import { AlertTriangle, Send, MapPin, Brain, BarChart3, Shield, ChevronRight, Zap } from 'lucide-react';
import Navbar from '../components/common/Navbar.jsx';

const features = [
  { icon: Brain,    title: 'Gemma 4 AI Analysis',   desc: 'Powered by Google\'s Gemma 4 model — analyzes photos and descriptions to assess damage severity instantly.' },
  { icon: MapPin,   title: 'Real-time Heatmap',      desc: 'Live interactive map showing affected zones with color-coded severity across Bangladesh.' },
  { icon: BarChart3,title: 'Priority Intelligence',  desc: 'Automatically ranks reports by urgency so relief teams always know where to go first.' },
  { icon: Shield,   title: 'Bengali Support',        desc: 'Field officers can submit reports in Bengali — AI handles translation and analysis seamlessly.' },
  { icon: Zap,      title: 'Instant Recommendations', desc: 'Recommends specific relief items — food, water, medicine, rescue — for each affected area.' },
  { icon: Send,     title: 'Automated Reports',      desc: 'Generates concise PDF summaries for relief coordinators and government agencies in seconds.' },
];

const stats = [
  { value: '<60s', label: 'Report Processing Time' },
  { value: 'Gemma 4', label: 'AI Model Powering Analysis' },
  { value: '6+', label: 'Relief Item Categories' },
  { value: '24/7', label: 'Real-time Monitoring' },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="page">
        {/* Hero */}
        <section style={{ padding: '80px 0 60px' }}>
          <div className="container" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
            <div className="animate-fade">
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 99,
                background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)',
                marginBottom: 24, fontSize: 13, color: 'var(--color-accent)', fontWeight: 600
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }} />
                Powered by Gemma 4 · Google AI Studio
              </div>

              <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, marginBottom: 20, lineHeight: 1.1 }}>
                AI-Powered{' '}
                <span style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Disaster Response
                </span>
                {' '}for Bangladesh
              </h1>

              <p style={{ fontSize: 18, color: 'var(--color-text-muted)', marginBottom: 40, lineHeight: 1.7, maxWidth: 600, margin: '0 auto 40px' }}>
                ReliefIQ helps relief organizations identify the most affected areas, prioritize victims, and allocate resources faster — powered by Gemma 4 vision AI.
              </p>

              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/submit" className="btn btn-primary btn-lg">
                  <Send size={18} /> Submit a Report
                </Link>
                <Link to="/status" className="btn btn-ghost btn-lg">
                  Track Report Status <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section style={{ padding: '20px 0 60px' }}>
          <div className="container">
            <div className="grid grid-cols-4 gap-4" style={{ maxWidth: 900, margin: '0 auto' }}>
              {stats.map(s => (
                <div key={s.label} className="card" style={{ padding: '24px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-accent)', marginBottom: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ padding: '20px 0 80px' }}>
          <div className="container">
            <h2 style={{ textAlign: 'center', fontSize: 32, marginBottom: 48 }}>
              How ReliefIQ Works
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {features.map(f => (
                <div key={f.title} className="card" style={{ padding: '28px 24px', transition: 'transform 0.2s ease, border-color 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = ''; }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                  }}>
                    <f.icon size={22} color="var(--color-accent)" />
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '0 0 80px' }}>
          <div className="container" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <div className="card" style={{ padding: '48px 40px', background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(59,130,246,0.08))' }}>
              <AlertTriangle size={40} color="var(--color-critical)" style={{ marginBottom: 16 }} />
              <h2 style={{ fontSize: 28, marginBottom: 12 }}>Disaster Happening Near You?</h2>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: 28, fontSize: 16 }}>
                Submit a report in seconds. Our AI will assess the damage and alert relief coordinators immediately.
              </p>
              <Link to="/submit" className="btn btn-primary btn-lg">
                <Send size={18} /> Submit Emergency Report
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ borderTop: '1px solid var(--color-border)', padding: '24px 0', textAlign: 'center' }}>
          <p className="text-muted" style={{ fontSize: 13 }}>
            © 2026 ReliefIQ · Build with Gemma 4 Hackathon · Made in Bangladesh 🇧🇩
          </p>
        </footer>
      </main>
    </>
  );
}
