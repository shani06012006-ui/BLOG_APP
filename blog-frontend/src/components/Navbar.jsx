import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useTheme from '../hooks/useTheme';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/blogs" className="brand">📝 BlogApp</Link>
      <div className="nav-links">
        <Link to="/blogs">All Blogs</Link>
        <Link to="/createblog" className="btn-nav">+ New Blog</Link>
        <Link to="/api-tester" className="btn-nav-api">🔌 API Tester</Link>
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <div className="nav-user">
          <span>{user}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;