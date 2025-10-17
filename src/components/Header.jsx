// src/components/Header.jsx
import React, { useState } from "react";
import logo from "../assets/logo.png";
import "../styles/dashboard.css";

export default function Header({ username, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <img src={logo} alt="Wizara Prep Logo" className="header-logo" />
        <span className="header-title">Wizara Prep</span>
      </div>

      <div className="header-right">
        <div className="user-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="user-avatar">{username[0]?.toUpperCase()}</div>
          <span className="user-email">{username}</span>
          <span className="chevron">▾</span>
        </div>

        {menuOpen && (
          <div className="dropdown-menu">
            <button onClick={onLogout}>Log out</button>
          </div>
        )}
      </div>
    </header>
  );
}
