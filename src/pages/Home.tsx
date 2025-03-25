import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import '../styles/Home.css';
import { UserContext } from '../context/UserContext';


interface Message {
  id: number;
  text: string;
  isUser: boolean;
  files?: { name: string; type: string }[]; // Tableau pour les fichiers
}

const Home: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
<<<<<<< HEAD
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Tableau pour les fichiers sélectionnés
=======
  const [rechercheIntelligente, setRechercheIntelligente] = useState(false);
>>>>>>> bd771ee123412df9ccb00922a30e3e411a3fa018
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      const validFiles = Array.from(files).filter((file) =>
        allowedTypes.includes(file.type)
      );

      if (validFiles.length === 0) {
        alert('Seuls les fichiers PDF, DOCX et Excel sont acceptés.');
        return;
      }

      // Ajoutez les fichiers valides au tableau sans les afficher comme messages
      setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (input.trim() === '' && selectedFiles.length === 0) return;

    // Ajouter le message utilisateur avec texte et fichiers
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
      files: selectedFiles.map((file) => ({ name: file.name, type: file.type })),
    };
    setMessages([...messages, userMessage]);

    // Préparer les données pour l'envoi
    const formData = new FormData();
    formData.append('utilisateur_id', user.id.toString());
    formData.append('contenu', input);

    selectedFiles.forEach((file) => {
      formData.append('fichiers', file); // Ajoutez chaque fichier au FormData
    });

    try {
<<<<<<< HEAD
      console.log('Envoi de la requête avec texte et fichiers :', formData);
=======
      console.log('Envoi de la question:', { utilisateur_id: user.id, contenu: input, recherche_intelligente: rechercheIntelligente });
>>>>>>> bd771ee123412df9ccb00922a30e3e411a3fa018

      const response = await fetch('http://localhost:5000/analyse', {
        method: 'POST',
<<<<<<< HEAD
        body: formData,
=======
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utilisateur_id: user.id, contenu: input, recherche_intelligente: rechercheIntelligente }),
>>>>>>> bd771ee123412df9ccb00922a30e3e411a3fa018
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Réponse analysée avec succès:', data);

        const aiMessage: Message = {
          id: Date.now() + 1,
          text: data.reponse || "Je n'ai pas trouvé de réponse à votre question.",
          isUser: false,
        };
        setMessages((prev) => [...prev, aiMessage]);
<<<<<<< HEAD
=======

        // Envoyer la réponse générée vers la base de données
        await fetch('http://localhost:5000/reponse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question_id: data.id,
            contenu: aiMessage.text,
            source: 'base_connaissance',
          }),
        });
>>>>>>> bd771ee123412df9ccb00922a30e3e411a3fa018
      } else {
        const errorData = await response.json();
        console.error('❌ Erreur lors de l’analyse de la requête:', errorData);
      }
    } catch (error) {
      console.error('❌ Erreur réseau:', error);
    }

    // Réinitialiser l'état après l'envoi
    setInput('');
    setSelectedFiles([]); // Réinitialisez les fichiers sélectionnés
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
                className={`message-group ${
                  message.isUser ? 'user-message-group' : 'ai-message-group'
                }`}
              >
                {message.files &&
                  message.files.map((file, index) => (
                    <div key={index} className="message file-message">
                      <strong>Fichier :</strong> {file.name} ({file.type})
                    </div>
                  ))}
                {message.text && (
                  <div className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}>
                    {message.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {user && (
        <div className="input-area">
          {selectedFiles.length > 0 && (
            <div className="file-preview">
              {selectedFiles.map((file, index) => (
                <p key={index}>
                  <strong>Fichier sélectionné :</strong> {file.name} ({file.type})
                </p>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question ici..."
              className="message-input"
            />
            <label htmlFor="file-upload" className="file-upload-button">
              <span role="img" aria-label="upload">
                📤
              </span>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.docx,.xlsx"
                multiple
                onChange={handleFileUpload}
                className="file-input"
              />
            </label>
            <button type="submit" className="send-button">
              <Send className="h-5 w-5" />
            </button>
          </form>
          <div className="recherche-option">
            <label className="recherche-label">
              <input
                type="checkbox"
                checked={rechercheIntelligente}
                onChange={(e) => setRechercheIntelligente(e.target.checked)}
                className="recherche-checkbox"
              />
              <span className="recherche-text">Recherche intelligente</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 