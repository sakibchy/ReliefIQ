import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, LayoutDashboard, Send, LogOut } from 'lucide-react';
import { logout } from '../../services/api';

export default function Navbar({ isAdmin = false }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <AlertTriangle size={18} color="#fff" />
          </div>
          ReliefIQ
        </Link>

        <div className="navbar-links">
          {isAdmin ? (
            <>
              <Link to="/admin" className="btn btn-ghost btn-sm">
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/status" className="btn btn-ghost btn-sm">
                Track Report
              </Link>
              <Link to="/submit" className="btn btn-primary btn-sm">
                <Send size={14} /> Submit Report
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
