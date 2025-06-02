import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Trash2, Search } from 'lucide-react';
import './styles/Chats.css';
import { UserContext } from '../../context/UserContext';

interface ChatLog {
  id: number;
  horodatage: string;
  question: string;
  reponse: string;
  theme: string | null;
}

const Chats: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [searchTerm, setSearchTerm] = useState(''); // État pour la barre de recherche

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Récupérer l'historique des interactions
    const fetchChatLogs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/logs_interaction?utilisateur_id=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setChatLogs(data);
        } else {
          console.error("Erreur lors de la récupération des logs d'interaction");
        }
      } catch (error) {
        console.error("Erreur réseau lors de la récupération des logs d'interaction:", error);
      }
    };

    fetchChatLogs();
  }, [user, navigate]);

  // Fonction pour supprimer une question et sa réponse 
  const handleDelete = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:5000/logs_interaction/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setChatLogs(chatLogs.filter((log) => log.id !== id));
            console.log(`Question avec ID ${id} supprimée avec succès.`);
        } else {
            console.error("Erreur lors de la suppression de la question.");
        }
    } catch (error) {
        console.error("Erreur réseau lors de la suppression de la question:", error);
    }
  };

  // Filtrer les logs en fonction du terme de recherche
  const filteredLogs = chatLogs.filter((log) =>
    log.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="chats-container">
      <h1 className="chats-title">Historique des Questions</h1>

      {/* Barre de recherche */}
      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher une question..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredLogs.length === 0 ? (
        <div className="empty-chats">
          <MessageSquare className="empty-icon" />
          <p className="empty-text">Aucun résultat trouvé.</p>
        </div>
      ) : (
        <div className="chats-list">
          {filteredLogs.map((log) => (
            <div key={log.id} className="chat-item">
              <div>
                <h3 className="chat-title">Question :</h3>
                <p className="chat-date">{new Date(log.horodatage).toLocaleString()}</p>
                <p className="chat-question">{log.question}</p>
                <h3 className="chat-title">Réponse :</h3>
                <p className="chat-response">{log.reponse}</p>
                {log.theme && (
                  <p className="chat-keyword">
                    <strong>Thème :</strong> {log.theme}
                  </p>
                )}
              </div>
              <div className="chat-actions">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(log.id)}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chats;