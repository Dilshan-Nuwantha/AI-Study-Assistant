import { Link } from "react-router-dom";
import { clearAuthState, getStoredUser } from "../../services/api";
import "./Navbar.css";

export default function Navbar() {
  const user = getStoredUser();
  const handleLogout = () => {
    clearAuthState();
    window.location.href = "/auth";
  };

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">
          <span className="navbar__logo" aria-hidden="true" />
          <span className="navbar__name">StudySense AI</span>
        </div>

        <div className="navbar__links">
          <Link className="navbar__link" to="/">Home</Link>
          <Link className="navbar__link" to="/upload">Upload</Link>
          <Link className="navbar__link" to="/chat">Chat</Link>
          <Link className="navbar__link" to="/quiz">Quiz</Link>
          {user ? (
            <>
              <Link className="navbar__link" to="/profile">Profile</Link>
              <button className="navbar__link" onClick={handleLogout} type="button">
                Logout ({user.username})
              </button>
            </>
          ) : (
            <Link className="navbar__link" to="/auth">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}