import React from 'react';
import { MessageSquare, User, Shield, BookOpen } from 'lucide-react';
import './styles/UserGuide.css';

const UserGuide: React.FC = () => {
  return (
    <div className="guide-container">
      <h1 className="guide-title">Guide d'Utilisateur</h1>
      
      <div className="guide-sections">
        <section className="guide-section">
          <div className="section-header">
            <MessageSquare className="section-icon" />
            <h2 className="section-title">Commencer une conversation</h2>
          </div>
          <div className="section-content">
            <p>
              Pour commencer une nouvelle conversation avec notre assistant IA, suivez ces étapes simples:
            </p>
            <ol className="guide-list ordered-list">
              <li>Accédez à la page d'accueil en cliquant sur "Accueil" dans la barre de navigation.</li>
              <li>Tapez votre question ou message dans la zone de texte en bas de l'écran.</li>
              <li>Appuyez sur le bouton d'envoi ou la touche Entrée pour envoyer votre message.</li>
              <li>Attendez la réponse du ChatBot.</li>
            </ol>
            <p>
              Vous pouvez continuer la conversation en envoyant des messages supplémentaires.
            </p>
          </div>
        </section>
        
        
        
        <section className="guide-section">
          <div className="section-header">
            <BookOpen className="section-icon" />
            <h2 className="section-title">Conseils d'utilisation</h2>
          </div>
          <div className="section-content">
            <p>
              Pour obtenir les meilleures réponses du ChatBot, suivez ces conseils utiles:
            </p>
            <ul className="guide-list unordered-list">
              <li>Posez des questions claires et spécifiques.</li>
              <li>Fournissez suffisamment de contexte pour qu'il comprenne votre demande.</li>
              <li>Pour des sujets complexes, décomposez votre question en plusieurs parties.</li>
              <li>Si la réponse n'est pas satisfaisante, essayez de reformuler votre question.</li>
            </ul>
          </div>
        </section>
        
        <section className="guide-section">
          <div className="section-header">
            <Shield className="section-icon" />
            <h2 className="section-title">Administration (pour les administrateurs)</h2>
          </div>
          <div className="section-content">
            <p>
              Si vous avez des privilèges d'administrateur, vous pouvez:
            </p>
            <ul className="guide-list unordered-list">
              <li>Accéder au tableau de bord d'administration via le menu déroulant.</li>
              <li>Gérer les utilisateurs (ajouter, modifier, supprimer).</li>
              <li>Surveiller l'activité du système.</li>
              <li>Résoudre les problèmes signalés par les utilisateurs.</li>
            </ul>
            <p className="admin-note">
              Note: Cette section est réservée aux administrateurs du système.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserGuide;