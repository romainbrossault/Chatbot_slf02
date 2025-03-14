import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Trash2 } from 'lucide-react';
import '../styles/Chats.css';
import { UserContext } from '../context/UserContext';

interface Chat {
  id: number;
  title: string;
  date: string;
}

const Chats: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const chats: Chat[] = [
    { id: 1, title: 'Chat #1', date: '2023-05-15' },
    { id: 2, title: 'Chat #2', date: '2023-05-16' },
    { id: 3, title: 'Chat #3', date: '2023-05-17' },
  ];

  return (
    <div className="chats-container">
      <h1 className="chats-title">Mes Conversations</h1>
      
      {chats.length === 0 ? (
        <div className="empty-chats">
          <MessageSquare className="empty-icon" />
          <p className="empty-text">Vous n'avez pas encore de conversations.</p>
          <p className="empty-text">Commencez une nouvelle conversation sur la page d'accueil.</p>
        </div>
      ) : (
        <div className="chats-list">
          {chats.map((chat) => (
            <div key={chat.id} className="chat-item">
              <div>
                <h3 className="chat-title">{chat.title}</h3>
                <p className="chat-date">{chat.date}</p>
              </div>
              <div className="chat-actions">
                <button className="delete-button">
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