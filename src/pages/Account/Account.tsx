import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import './styles/Account.css';

const Account: React.FC = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <div className="account-container">
      <h1 className="account-title">Mon Compte</h1>
      {user ? (
        <div className="account-details">
          <p><strong>Nom:</strong> {user.nom}</p>
          <p><strong>Prénom:</strong> {user.prenom}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rôle:</strong> {user.role}</p>
          <button onClick={logout} className="logout-button">Se déconnecter</button>
        </div>
      ) : (
        <p>Vous n'êtes pas connecté.</p>
      )}
    </div>
  );
};

export default Account;