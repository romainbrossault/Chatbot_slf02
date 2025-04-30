import React from 'react';

const ConfirmationPending: React.FC = () => {
  return (
    <div className="confirmation-pending-container">
      <h1>Confirmation requise</h1>
      <p>
        Un e-mail de confirmation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception pour confirmer votre compte.
      </p>
    </div>
  );
};

export default ConfirmationPending;