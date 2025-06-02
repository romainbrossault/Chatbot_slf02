import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import './styles/Register.css';
import { UserContext } from '../../context/UserContext';

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptRGPD, setAcceptRGPD] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    email?: string;
    rgpd?: string;

  }>({} as any);
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  // Le rôle est fixé à "eleve" pour tous les nouveaux inscrits
  const role = 'eleve';
    const domain = '@stfelixlasalle.fr';

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*]/.test(password);
  return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars
  );
};

  // Validation de l'email en temps réel
  useEffect(() => {
    if (email && email.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        setErrors(prev => ({ ...prev, email: 'Format d\'email invalide' }));
      } else if (!email.endsWith(domain)) {
        setErrors(prev => ({ ...prev, email: `L'adresse e-mail doit se terminer par ${domain}` }));
      } else {
        setErrors(prev => {
          const { email, ...rest } = prev;
          return rest;
        });
      }
    } else {
      setErrors(prev => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors: {
      password?: string;
      email?: string;
      rgpd?: string;
    } = {};

    if (password !== confirmPassword) {
      newErrors.password = 'Les mots de passe ne correspondent pas';
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial';
    }

    if (!acceptRGPD) {
      newErrors.rgpd = 'Vous devez accepter les conditions RGPD';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email) || !email.endsWith(domain)) {
      newErrors.email = `L'adresse e-mail doit se terminer par ${domain}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/utilisateur', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: lastName,
          prenom: firstName,
          date_naissance: birthDate,
          email,
          password,
          role,
        }),
      });

      if (response.ok) {
        console.log('Un e-mail de confirmation a été envoyé.');
        navigate('/confirmation-pending');
      } else {
        setErrors({ ...errors, email: 'La création du compte a échoué' });
      }
    } catch (error) {
      console.error('Error during account creation:', error);
      setErrors({ ...errors, email: 'Erreur lors de la création du compte' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-container">
        <div>
          <h2 className="register-title">Créer un compte</h2>
          <p className="register-subtitle">Utilisez votre adresse email {domain} pour vous inscrire</p>
        </div>
        <form
          className="register-form"
          onSubmit={handleSubmit}
          aria-label="Formulaire d'inscription"
          noValidate
        >
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
              <div className="input-wrapper">
                <div className="input-icon">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="last-name"
                  name="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="form-input form-input-with-icon"
                  placeholder="Nom"
                />
              </div>
            </div>
          </div>
          <div className="input-wrapper">
            <input
              id="birth-date"
              name="birthDate"
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="form-input"
              placeholder="Date de naissance"
            />
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
              className={`form-input form-input-with-icon ${errors.email ? 'has-error' : ''}`}
              placeholder={`Adresse email${domain}`}
              aria-invalid={errors.email ? 'true' : 'false'}
            />





            {errors.email && (
              <span className="error-message" role="alert">
                {errors.email}
              </span>
            )}
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
              className={`form-input form-input-with-icon ${errors.password ? 'has-error' : ''}`}

              placeholder="Mot de passe"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
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
              className={`form-input form-input-with-icon ${errors.password ? 'has-error' : ''}`}
              placeholder="Confirmer le mot de passe"
            />







          </div>

















          <div className="rgpd-container">
            <input
              type="checkbox"
              id="accept-rgpd"
              checked={acceptRGPD}
              onChange={(e) => setAcceptRGPD(e.target.checked)}
              required
              className={errors.rgpd ? 'has-error' : ''}
            />
            <label htmlFor="accept-rgpd">
              J'accepte les{' '}
              <Link to="/rgpd" className="rgpd-link">
                conditions RGPD
            </Link>

            </label>
            {errors.rgpd && <span className="error-message">{errors.rgpd}</span>}
        </div>

          <div>
            <button
              type="submit"
              className="register-button"
              disabled={isLoading || Boolean(errors.email)}
              aria-busy={isLoading}
            >
              {isLoading ? 'Création en cours...' : 'Créer un compte'}
              {isLoading && <span className="loading-spinner">⌛</span>}
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