import React from 'react';
import '../styles/RGPD.css';

const RGPD: React.FC = () => {
  return (
    <div className="rgpd-container">
      <div className="rgpd-header">
        <h1 className="rgpd-title">Conditions RGPD</h1>
      </div>

      <div className="rgpd-cards">
        {/* Section 1 : Prise d'information de l'utilisateur */}
        <div className="rgpd-card">
          <h2 className="rgpd-section-title">1. Prise d'information de l'utilisateur</h2>
          <p>
            Nous collectons des informations personnelles telles que votre nom, prénom, adresse email et rôle (élève, enseignant, administrateur) lors de votre inscription. Ces informations sont nécessaires pour vous fournir un accès personnalisé à nos services.
          </p>
          <p>
            Ces données sont collectées de manière transparente et avec votre consentement explicite. Elles ne seront utilisées que dans le cadre de l'utilisation de notre plateforme.
          </p>
        </div>

        {/* Section 2 : Sauvegarde des conversations */}
        <div className="rgpd-card">
          <h2 className="rgpd-section-title">2. Sauvegarde des conversations</h2>
          <p>
            Les conversations effectuées sur notre plateforme sont sauvegardées afin d'améliorer la qualité de nos services et de fournir un historique accessible à l'utilisateur. Ces données peuvent inclure vos questions et les réponses générées par le chatbot.
          </p>
          <p>
            Les données des conversations sont stockées de manière sécurisée et ne sont accessibles qu'aux administrateurs autorisés. Elles ne seront jamais partagées avec des tiers sans votre consentement explicite.
          </p>
        </div>

        {/* Section 3 : Droits des utilisateurs */}
        <div className="rgpd-card">
          <h2 className="rgpd-section-title">3. Droits des utilisateurs</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
          </p>
          <ul className="rgpd-list">
            <li><strong>Droit d'accès :</strong> Vous pouvez demander à accéder aux données personnelles que nous avons collectées à votre sujet.</li>
            <li><strong>Droit de rectification :</strong> Vous pouvez demander la correction de vos données personnelles si elles sont inexactes ou incomplètes.</li>
            <li><strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression de vos données personnelles, sauf si leur conservation est nécessaire pour des raisons légales.</li>
            <li><strong>Droit à la portabilité :</strong> Vous pouvez demander à recevoir vos données personnelles dans un format structuré et lisible par machine.</li>
            <li><strong>Droit d'opposition :</strong> Vous pouvez vous opposer à l'utilisation de vos données personnelles dans certains cas.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RGPD;