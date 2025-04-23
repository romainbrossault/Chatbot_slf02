import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminKnowledge.css';

const AdminKnowledge: React.FC = () => {
  const [themes, setThemes] = useState<any[]>([]); // Liste des thèmes depuis la base de données
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null); // ID du thème sélectionné
  const [contenu, setContenu] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [searchThemeId, setSearchThemeId] = useState<number | null>(null); // ID du thème pour la recherche
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]); // Liste des contenus
  const [isPopupOpen, setIsPopupOpen] = useState(false); // État pour la pop-up
  const [newThemeName, setNewThemeName] = useState(''); // Nom du nouveau thème
  const [popupMessage, setPopupMessage] = useState<string | null>(null); // Message de confirmation dans la pop-up
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les thèmes depuis la table "theme"
    const fetchThemes = async () => {
      try {
        const response = await fetch('http://localhost:5000/theme');
        if (response.ok) {
          const data = await response.json();
          setThemes(data);
        } else {
          console.error('Erreur lors de la récupération des thèmes');
        }
      } catch (error) {
        console.error('Erreur réseau lors de la récupération des thèmes:', error);
      }
    };

    // Récupérer les contenus de la table "base_connaissance"
    const fetchKnowledge = async () => {
      try {
        const response = await fetch('http://localhost:5000/base_connaissance');
        if (response.ok) {
          const data = await response.json();
          setKnowledgeList(data);
        } else {
          console.error('Erreur lors de la récupération des contenus');
        }
      } catch (error) {
        console.error('Erreur réseau lors de la récupération des contenus:', error);
      }
    };

    fetchThemes();
    fetchKnowledge();
  }, []);

  const handleAddTheme = async () => {
    if (!newThemeName.trim()) {
      setPopupMessage('Veuillez entrer un nom de thème.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nom: newThemeName }),
      });

      if (response.ok) {
        const newTheme = await response.json();
        setThemes((prevThemes) => [...prevThemes, newTheme]);
        setNewThemeName('');
        setPopupMessage('Thème ajouté avec succès.');
      } else {
        setPopupMessage('Erreur lors de l’ajout du thème.');
      }
    } catch (error) {
      console.error('Erreur réseau lors de l’ajout du thème:', error);
      setPopupMessage('Erreur réseau. Veuillez réessayer.');
    }
  };

  const filteredKnowledge = knowledgeList.filter(
    (item) => item.theme_id === searchThemeId
  );

  return (
    <div className="admin-knowledge-container">
      <h1 className="admin-knowledge-title">Gestion des Connaissances</h1>

      {/* Notification */}
      {notification && <div className="notification">{notification}</div>}

      <div className="admin-knowledge-grid">
        {/* Bloc d'ajout de thème */}
        <div className="theme-block">
          <button className="add-theme-button" onClick={() => setIsPopupOpen(true)}>
            Ajouter un Thème
          </button>
          <button
            onClick={() => navigate('/manage-theme')} // Redirection vers la page "ManageTheme"
            className="manage-theme-button"
          >
            Gérer les Thèmes
          </button>
        </div>

        {/* Pop-up pour ajouter un thème */}
        {isPopupOpen && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h2>Ajouter un Thème</h2>
              <input
                type="text"
                value={newThemeName}
                onChange={(e) => setNewThemeName(e.target.value)}
                placeholder="Nom du thème"
                className="popup-input"
              />
              <div className="popup-actions">
                <button className="popup-button" onClick={handleAddTheme}>
                  Ajouter
                </button>
                <button
                  className="popup-button cancel"
                  onClick={() => {
                    setIsPopupOpen(false);
                    setPopupMessage(null); // Réinitialiser le message
                  }}
                >
                  Annuler
                </button>
              </div>
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

        

        {/* Bloc d'ajout de contenu */}
        <div className="content-block">
          <h2>Ajouter un Contenu</h2>
          <form onSubmit={(e) => e.preventDefault()} className="admin-knowledge-form">
            <div className="form-group">
              <label htmlFor="theme">Thèmes :</label>
              <select
                id="theme"
                value={selectedThemeId || ''}
                onChange={(e) => setSelectedThemeId(Number(e.target.value))}
                required
              >
                <option value="">Sélectionnez un thème</option>
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.nom}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="contenu">Contenu :</label>
              <textarea
                id="contenu"
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Ajouter
            </button>
          </form>
        </div>

        {/* Bloc de liste des contenus */}
        <div className="list-block">
          <h2>Liste des Contenus</h2>
          <div className="search-bar">
            <select
              value={searchThemeId || ''}
              onChange={(e) => setSearchThemeId(Number(e.target.value))}
            >
              <option value="">Sélectionnez un thème</option>
              {themes.map((theme) => (
                <option key={theme.id} value={theme.id}>
                  {theme.nom}
                </option>
              ))}
            </select>
          </div>
          <ul className="knowledge-list">
            {filteredKnowledge.map((item) => (
              <li key={item.id}>
                <strong>Thème:</strong> {themes.find((t) => t.id === item.theme_id)?.nom} <br />
                <strong>Contenu:</strong> {item.contenu}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminKnowledge;