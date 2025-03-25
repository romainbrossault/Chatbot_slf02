import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminKnowledge.css';

const AdminKnowledge: React.FC = () => {
  const [motCle, setMotCle] = useState('');
  const [contenu, setContenu] = useState('');
  const [notification, setNotification] = useState<string | null>(null); // État pour la notification
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/base_connaissance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mot_cle: motCle,
          contenu,
        }),
      });

      if (response.ok) {
        console.log('✅ Connaissance ajoutée avec succès');
        setMotCle('');
        setContenu('');
        setNotification('Connaissance ajoutée avec succès !'); // Affiche la notification

        // Masquer la notification après 3 secondes
        setTimeout(() => {
          setNotification(null);
          navigate('/admin-knowledge'); // Redirige après la notification
        }, 5000);
      } else {
        console.error('❌ Échec de l’ajout de la connaissance');
        setNotification('Échec de l’ajout de la connaissance.'); // Affiche une notification d'erreur
        setTimeout(() => setNotification(null), 8000); // Masquer après 3 secondes
      }
    } catch (error) {
      console.error('❌ Erreur lors de l’ajout de la connaissance:', error);
      setNotification('Erreur réseau. Veuillez réessayer.'); // Affiche une notification d'erreur réseau
      setTimeout(() => setNotification(null), 8000); // Masquer après 3 secondes
    }
  };

  return (
    <div className="admin-knowledge-container">
      <h1 className="admin-knowledge-title">Ajouter une Connaissance</h1>

      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}

      <form onSubmit={handleSubmit} className="admin-knowledge-form">
        <div className="form-group">
          <label htmlFor="motCle">Mot Clé</label>
          <input
            type="text"
            id="motCle"
            value={motCle}
            onChange={(e) => setMotCle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="contenu">Contenu</label>
          <textarea
            id="contenu"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-button">Ajouter</button>
      </form>
    </div>
  );
};

export default AdminKnowledge;