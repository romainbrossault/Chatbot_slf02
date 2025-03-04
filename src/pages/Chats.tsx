import React from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';
import '../styles/Chats.css';

interface Chat {
  id: number;
  title: string;
  date: string;
}

const Chats: React.FC = () => {
  // Mock data for chats
  const chats: Chat[] = [
    { id: 1, title: 'Comment créer un site web?', date: '2023-05-15' },
    { id: 2, title: 'Qu\'est-ce que React?', date: '2023-05-16' },
    { id: 3, title: 'Comment utiliser Tailwind CSS?', date: '2023-05-17' },
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