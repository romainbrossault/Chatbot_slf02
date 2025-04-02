import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import '../styles/Login.css';
import { UserContext } from '../context/UserContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/utilisateur/login?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        login(data);
        navigate('/');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
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
              <span className="input-icon">
                <User className="icon-svg" />
              </span>
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
              <span className="input-icon">
                <Lock className="icon-svg" />
              </span>
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
            <button type="submit" className="login-button">
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