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
    const newTheme = prompt('Entrez le nom du nouveau thème :');
    if (newTheme) {
      try {
        const response = await fetch('http://localhost:5000/theme', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nom: newTheme }),
        });

        if (response.ok) {
          const data = await response.json();
          setThemes([...themes, data]);
          setNotification('Thème ajouté avec succès !');
          setTimeout(() => setNotification(null), 5000);
        } else {
          console.error('Erreur lors de l’ajout du thème');
        }
      } catch (error) {
        console.error('Erreur réseau lors de l’ajout du thème:', error);
      }
    }
  };

  const handleDeleteTheme = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/theme/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setThemes(themes.filter((theme) => theme.id !== id));
        setNotification('Thème supprimé avec succès !');
        setTimeout(() => setNotification(null), 5000);
      } else {
        console.error('Erreur lors de la suppression du thème');
      }
    } catch (error) {
      console.error('Erreur réseau lors de la suppression du thème:', error);
    }
  };

  const handleRenameTheme = async (id: number) => {
    const newName = prompt('Entrez le nouveau nom du thème :');
    if (newName) {
      try {
        const response = await fetch(`http://localhost:5000/theme/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nom: newName }),
        });

        if (response.ok) {
          setThemes(
            themes.map((theme) =>
              theme.id === id ? { ...theme, nom: newName } : theme
            )
          );
          setNotification('Thème renommé avec succès !');
          setTimeout(() => setNotification(null), 5000);
        } else {
          console.error('Erreur lors du renommage du thème');
        }
      } catch (error) {
        console.error('Erreur réseau lors du renommage du thème:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedThemeId) {
      setNotification('Veuillez sélectionner un thème.');
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/base_connaissance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          theme_id: selectedThemeId,
          contenu,
        }),
      });

      if (response.ok) {
        console.log('✅ Connaissance ajoutée avec succès');
        setSelectedThemeId(null);
        setContenu('');
        setNotification('Connaissance ajoutée avec succès !');
        setTimeout(() => setNotification(null), 5000);
      } else {
        console.error('❌ Échec de l’ajout de la connaissance');
        setNotification('Échec de l’ajout de la connaissance.');
        setTimeout(() => setNotification(null), 8000);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l’ajout de la connaissance:', error);
      setNotification('Erreur réseau. Veuillez réessayer.');
      setTimeout(() => setNotification(null), 8000);
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
          <h2>Ajouter un Thème</h2>
          <button onClick={handleAddTheme} className="add-theme-button">
            Ajouter un Thème
          </button>
          <ul className="theme-list">
            {themes.map((theme) => (
              <li key={theme.id}>
                {theme.nom}
                <button
                  onClick={() => handleRenameTheme(theme.id)}
                  className="rename-button"
                >
                  Renommer
                </button>
                <button
                  onClick={() => handleDeleteTheme(theme.id)}
                  className="delete-button"
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Bloc d'ajout de contenu */}
        <div className="content-block">
          <h2>Ajouter un Contenu</h2>
          <form onSubmit={handleSubmit} className="admin-knowledge-form">
            <div className="form-group">
              <label htmlFor="theme">Thème</label>
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
              <label htmlFor="contenu">Contenu</label>
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