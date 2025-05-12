import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './styles/ManageTheme.css';

const ManageTheme: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Redirection si l'utilisateur n'est pas administrateur
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/'); // Redirige vers la page d'accueil
    }
  }, [user, navigate]);

  const [themes, setThemes] = useState<any[]>([]); // Liste des thèmes
  const [loading, setLoading] = useState<boolean>(true); // État de chargement
  const [error, setError] = useState<string | null>(null); // État d'erreur
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // État pour la pop-up
  const [selectedTheme, setSelectedTheme] = useState<any | null>(null); // Thème sélectionné pour modification
  const [updatedName, setUpdatedName] = useState<string>(''); // Nom mis à jour du thème
  const [notification, setNotification] = useState<string | null>(null); // Message de notification
  const [popupMessage, setPopupMessage] = useState<string | null>(null); // Message de notification
  const [deletePopupMessage, setDeletePopupMessage] = useState<string | null>(null); // Message de notification pour la suppression

  useEffect(() => {
    // Fonction pour récupérer les thèmes depuis la base de données
    const fetchThemes = async () => {
      try {
        const response = await fetch('http://localhost:5000/theme'); // Remplacez par l'URL de votre API
        if (response.ok) {
          const data = await response.json();
          setThemes(data);
        } else {
          setError('Erreur lors de la récupération des thèmes.');
        }
      } catch (err) {
        setError('Erreur réseau. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  const openModal = (theme: any) => {
    setSelectedTheme(theme);
    setUpdatedName(theme.nom); // Pré-remplir le champ avec le nom actuel
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTheme(null);
    setUpdatedName('');
  };

  const handleSaveChanges = async () => {
    if (!selectedTheme) return;

    try {
      const response = await fetch(`http://localhost:5000/theme/${selectedTheme.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom: updatedName }),
      });

      if (response.ok) {
        // Mettre à jour la liste des thèmes localement
        setThemes((prevThemes) =>
          prevThemes.map((theme) =>
            theme.id === selectedTheme.id ? { ...theme, nom: updatedName } : theme
          )
        );
        closeModal();
        setPopupMessage('Thème modifié avec succès.');
      } else {
        setPopupMessage('Erreur lors de la modification du thème.');
      }
    } catch (err) {
      setPopupMessage('Erreur réseau. Veuillez réessayer.');
    }
  };

  const handleDeleteTheme = async (themeId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/theme/${themeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Supprimer le thème localement
        setThemes((prevThemes) => prevThemes.filter((theme) => theme.id !== themeId));
        setDeletePopupMessage('Thème supprimé avec succès.');
      } else {
        setDeletePopupMessage('Erreur lors de la suppression du thème.');
      }
    } catch (err) {
      setDeletePopupMessage('Erreur réseau. Veuillez réessayer.');
    }
  };

  return (
    <div className="manage-theme-container">
      <h1 className="manage-theme-title">Gérer les Thèmes</h1>

      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}

      {loading && <p>Chargement des thèmes...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <ul className="theme-list">
          {themes.map((theme) => (
            <li key={theme.id} className="theme-item">
              <span className="theme-name">{theme.nom}</span>
              <div className="theme-actions">
                <button
                  className="edit-button"
                  onClick={() => openModal(theme)}
                >
                  Modifier
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteTheme(theme.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {deletePopupMessage && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p className="popup-message">{deletePopupMessage}</p>
            <button
              className="popup-button"
              onClick={() => setDeletePopupMessage(null)} // Fermer la notification
            >
              OK
            </button>
          </div>
        </div>
      )}

      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p className="popup-message">{popupMessage}</p>
            <button
              className="popup-button"
              onClick={() => setPopupMessage(null)} // Fermer la notification
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Pop-up modale */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Modifier le Thème</h2>
            <div className="form-group">
              <label htmlFor="theme-name">Nom du Thème</label>
              <input
                id="theme-name"
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="save-button" onClick={handleSaveChanges}>
                Enregistrer
              </button>
              <button className="cancel-button" onClick={closeModal}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTheme;