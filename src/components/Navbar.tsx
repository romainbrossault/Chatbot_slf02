import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Home, MessageSquare, ChevronDown, User, Shield, BookOpen } from 'lucide-react';
import '../styles/Navbar.css';

import logo from '../img/logo02.svg';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-left">
            <Link to="/" className="navbar-logo">
              <img src={logo} alt="Logo" className="logo-icon" />
              <span className="logo-text">ChatBot</span>
            </Link>
            <div className="navbar-links">
              <Link to="/" className="navbar-link">
                <Home className="link-icon" />
                Accueil
              </Link>
              <Link to="/chats" className="navbar-link">
                <MessageSquare className="link-icon" />
                Mes Conversations
              </Link>
            </div>
          </div>
          <div className="dropdown">
            <button
              onClick={toggleDropdown}
              className="dropdown-button"
            >
              <User className="dropdown-icon" />
              <span>Menu</span>
              <ChevronDown className="chevron-icon" />
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link
                  to="/login"
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="dropdown-item-icon" />
                  Connexion
                </Link>
                <Link
                  to="/admin"
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Shield className="dropdown-item-icon" />
                  Administration
                </Link>
                <Link
                  to="/guide"
                  className="dropdown-item"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <BookOpen className="dropdown-item-icon" />
                  Guide d'utilisateur
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;