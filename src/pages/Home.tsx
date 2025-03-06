import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import '../styles/Home.css';
import { UserContext } from '../context/UserContext';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const Home: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  console.log("Utilisateur connecté:", user); // Debug

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (input.trim() === '') return;

    // Ajouter le message utilisateur
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
    };

    setMessages([...messages, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:5000/question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          utilisateur_id: user.id, // ✅ Envoi correct de l'ID utilisateur
          contenu: input,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Question ajoutée avec succès:', data);

        // Ajouter une réponse générée par défaut
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: "Ceci est une réponse générée par défaut.",
          isUser: false,
        };
        setMessages(prev => [...prev, aiMessage]);

        // Envoyer la réponse générée vers la base de données
        await fetch('http://localhost:5000/reponse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question_id: data.id,
            contenu: aiMessage.text,
            source: 'test', // Remplacez par la source appropriée si nécessaire
          }),
        });
      } else {
        console.error('❌ Échec de l’ajout de la question');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la soumission de la question:', error);
    }
  };

  return (
    <div className="home-container">
      <div className="chat-area">
        {messages.length === 0 ? (
          <div className="welcome-container">
            <div className="welcome-content">
              <h1 className="welcome-title">CHATBOT</h1>
              <p className="welcome-text">
                Bienvenue sur le ChatBot. Posez une question pour commencer une conversation.
              </p>
              {!user && (
                <Link to="/login" className="login-button">
                  Se connecter pour commencer à discuter
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
              >
                {message.text}
              </div>
            ))}
          </div>
        )}
      </div>
      {user && (
        <div className="input-area">
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question ici..."
              className="message-input"
            />
            <button type="submit" className="send-button">
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;