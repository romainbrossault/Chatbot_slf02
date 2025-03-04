import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import '../styles/Register.css';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration attempt with:', { firstName, lastName, email, password });
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <div>
          <h2 className="register-title">Créer un compte</h2>
        </div>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="name-row">
            <div>
              <label htmlFor="first-name" className="sr-only">
                Prénom
              </label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="first-name"
                  name="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="form-input form-input-with-icon"
                  placeholder="Prénom"
                />
              </div>
            </div>
            <div>
              <label htmlFor="last-name" className="sr-only">
                Nom
              </label>
              <input
                id="last-name"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-input"
                placeholder="Nom"
              />
            </div>
          </div>
          <div className="input-wrapper">
            <div className="input-icon">
              <Mail className="h-5 w-5" />
            </div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input form-input-with-icon"
              placeholder="Adresse email"
            />
          </div>
          <div className="input-wrapper">
            <div className="input-icon">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input form-input-with-icon"
              placeholder="Mot de passe"
            />
          </div>
          <div className="input-wrapper">
            <div className="input-icon">
              <Lock className="h-5 w-5" />
            </div>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input form-input-with-icon"
              placeholder="Confirmer le mot de passe"
            />
          </div>

          <div>
            <button
              type="submit"
              className="register-button"
            >
              Créer un compte
            </button>
          </div>
        </form>
        <div className="login-link-container">
          <p className="login-text">
            Vous avez déjà un compte?{' '}
            <Link to="/login" className="login-link">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;