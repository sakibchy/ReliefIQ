import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Submit from './pages/Submit.jsx';
import Status from './pages/Status.jsx';
import Admin from './pages/Admin.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/submit"       element={<Submit />} />
        <Route path="/status"       element={<Status />} />
        <Route path="/admin"        element={<Admin />} />
        <Route path="/admin/login"  element={<Login />} />
        <Route path="*"             element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
