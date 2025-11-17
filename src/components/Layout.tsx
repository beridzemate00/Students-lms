import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const linkClass = (path: string) =>
    "sidebar-link" + (location.pathname === path ? " active" : "");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-circle">L</div>
          <div>
            <div className="logo-title">Students LMS</div>
            <div className="logo-subtitle">
              {currentUser?.role.toUpperCase()} panel
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className={linkClass("/")}>
            Dashboard
          </Link>
          <Link to="/courses" className={linkClass("/courses")}>
            Courses
          </Link>
          <Link to="/assignments" className={linkClass("/assignments")}>
            Assignments
          </Link>
          {currentUser?.role === "admin" && (
            <Link to="/users" className={linkClass("/users")}>
              Users
            </Link>
          )}
        </nav>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="topbar-title">Welcome, {currentUser?.name}</div>
          <div className="topbar-right">
            <span className="pill">{currentUser?.role}</span>
            <button className="btn-secondary" onClick={logout}>
              Log out
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
