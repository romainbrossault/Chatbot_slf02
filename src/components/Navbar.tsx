import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Home, MessageSquare, User, BookOpen, LogOut, ChevronDown, Ticket, Settings } from 'lucide-react';
import '../styles/Navbar.css';
import { UserContext } from '../context/UserContext';

import logo from '../img/logo02.svg';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(UserContext);

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
              {user && (
                <>
                  <Link to="/chats" className="navbar-link">
                    <MessageSquare className="link-icon" />
                    Mes Questions
                  </Link>
                  <Link to="/ticket" className="navbar-link">
                    <Ticket className="link-icon" />
                    Ticket
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="navbar-right">
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
                  {user ? (
                    <>
                      <Link
                        to="/account"
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="dropdown-item-icon" />
                        Mon Compte
                      </Link>
                      {user.email === 'admin@chatbot.fr' && (
                        <Link
                          to="/admin"
                          className="dropdown-item"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings className="dropdown-item-icon" />
                          Administration
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="dropdown-item"
                      >
                        <LogOut className="dropdown-item-icon" />
                        Se déconnecter
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="dropdown-item-icon" />
                        Connexion
                      </Link>
                      <Link
                        to="/register"
                        className="dropdown-item"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="dropdown-item-icon" />
                        Créer un compte
                      </Link>
                    </>
                  )}
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
      </div>
    </nav>
  );
};

export default Navbar;