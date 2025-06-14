import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Send, Key } from 'lucide-react';
import './styles/Home.css';
import { UserContext } from '../../context/UserContext';
import logo from '../../img/logo02.svg';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const Home: React.FC = () => {
  const [input, setInput] = useState('');
  const [isPasswordTest, setIsPasswordTest] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const maskPassword = (text: string): string => {
    const passwordRegex = /Tester mon mot de passe\s*:\s*(\S+)/i;
    return text.replace(passwordRegex, (match, p1) => {
      return `Test du mot de passe : ${'*'.repeat(p1.length)}`;
    });
  };

  const handleGeneratePassword = () => {
    const generatedPassword = generatePassword();
    const passwordMessage: Message = {
      id: Date.now(),
      text: `Mot de passe généré : ${generatedPassword}`,
      isUser: false,
    };
    setMessages((prev) => [...prev, passwordMessage]);
    setShowPasswordPopup(false); // Fermer la pop-up
  };

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    return password;
  };

  const handleSubmit = async (e?: React.FormEvent, question?: string) => {
    if (e) e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    const questionText = question || input.trim();
    if (questionText === '') return;

    const userMessage: Message = {
      id: Date.now(),
      text: isPasswordTest ? `Tester mon mot de passe : ${questionText}` : questionText,
      isUser: true,
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsPasswordTest(false);

    try {
      const response = await fetch('http://localhost:5000/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utilisateur_id: user.id,
          contenu: userMessage.text,
          conversation_id: conversationId,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const aiMessage: Message = {
          id: Date.now() + 1,
          text: maskPassword(data.reponse || "Je n'ai pas trouvé de réponse à votre question."),
          isUser: false,
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Suggestions de questions si un thème est identifié
        if (data.theme_id) {
          fetch(`http://localhost:5000/suggestions?theme_id=${data.theme_id}`)
            .then(res => res.json())
            .then(suggestionsData => setSuggestions(suggestionsData));
        } else {
          setSuggestions([]);
        }

        if (!conversationId && data.conversation_id) {
          setConversationId(data.conversation_id);
        }
      } else {
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: "Je n'ai pas compris votre question. Pouvez-vous reformuler ?",
          isUser: false,
        };
        setMessages((prev) => [...prev, aiMessage]);
        setSuggestions([]);
      }
    } catch (error) {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: "Une erreur est survenue. Veuillez réessayer.",
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="home-container">
      <div className="chat-area" ref={chatAreaRef}>
        {messages.length === 0 ? (
          <div className="welcome-container">
            <div className="welcome-content">
              <h1 className="welcome-title">CHATBOT</h1>
              <p className="welcome-text">
                Bienvenue sur le ChatBot. Posez une question pour commencer une conversation.
              </p>
              {!user && (
                <Link to="/login" className="login-button">
                  Se connecter pour discuter
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${message.isUser ? 'user-message-wrapper' : 'ai-message-wrapper'}`}
              >
                {!message.isUser && (
                  <div className="ai-message-full">
                    <img src={logo} alt="Logo" className="ai-logo" />
                    <div className="message ai-message">
                      {maskPassword(message.text)}
                    </div>
                  </div>
                )}

                {message.isUser && (
                  <div className="message user-message">
                    {maskPassword(message.text)}
                  </div>
                )}
              </div>
            ))}
            {suggestions.length > 0 && (
              <div className="suggestions-list">
                <h3>Autres réponses pour ce thème :</h3>
                <ul>
                  {suggestions.map((s: any) => (
                    <li key={s.id} className="suggestion-item">{s.suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {user && (
        <div className="input-area">
          <form onSubmit={handleSubmit} className="input-form">
            <button
              type="button"
              onClick={() => setShowPasswordPopup(true)}
              className="test-password-button"
            >
              <Key className="h-5 w-5" />
              Mot de passe
            </button>
            <div className="message-input-wrapper">
              {isPasswordTest && <span className="fixed-text">Tester mon mot de passe : </span>}
              <input
                type={isPasswordTest ? 'password' : 'text'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isPasswordTest ? '' : 'Posez votre question ici...'}
                className="message-input"
              />
            </div>
            <button type="submit" className="send-button">
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}

      {showPasswordPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Mot de passe</h2>
            <button onClick={() => { setIsPasswordTest(true); setShowPasswordPopup(false); }}>Tester MDP</button>
            <button onClick={handleGeneratePassword}>Générer MDP</button>
            <button onClick={() => setShowPasswordPopup(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;