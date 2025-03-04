import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { email, password });
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div>
          <h2 className="login-title">Connexion</h2>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-wrapper">
              <div className="input-icon">
                <User className="h-5 w-5" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Adresse email"
              />
            </div>
          </div>
          <div className="input-group">
            <div className="input-wrapper">
              <div className="input-icon">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="remember-checkbox"
              />
              <label htmlFor="remember-me" className="remember-label">
                Se souvenir de moi
              </label>
            </div>

            <div>
              <a href="#" className="forgot-password">
                Mot de passe oublié?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="login-button"
            >
              Se connecter
            </button>
          </div>
        </form>
        <div className="signup-link-container">
          <p className="signup-text">
            Vous n'avez pas de compte?{' '}
            <Link to="/register" className="signup-link">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;