import React, { useState } from 'react';
import { Send } from 'lucide-react';
import '../styles/Home.css';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const Home: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
    };
    
    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: `Voici une réponse simulée à votre message: "${input}"`,
        isUser: false,
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="home-container">
      <div className="chat-area">
        {messages.length === 0 ? (
          <div className="welcome-container">
            <div className="welcome-content">
              <h1 className="welcome-title">ChatGPT Clone</h1>
              <p className="welcome-text">
                Bienvenue sur notre clone de ChatGPT. Posez une question pour commencer une conversation.
              </p>
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
      <div className="input-area">
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question ici..."
            className="message-input"
          />
          <button
            type="submit"
            className="send-button"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;