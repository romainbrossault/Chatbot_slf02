import React, { useState, useEffect, useContext } from 'react';
import './styles/Ticket.css';
import { UserContext } from '../../context/UserContext'; // Import du contexte utilisateur

interface Ticket {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  niveau_urgence: string;
  statut: number;
}

const Ticket: React.FC = () => {
  const { user } = useContext(UserContext); // Récupérer l'utilisateur connecté
  const [tickets, setTickets] = useState<Ticket[]>([]); // Historique des tickets
  const [isCreating, setIsCreating] = useState(false); // État pour basculer entre l'historique et la création
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [categorie, setCategorie] = useState('bug');
  const [niveauUrgence, setNiveauUrgence] = useState('bas');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Charger les tickets existants
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) {
        console.error("Utilisateur non connecté");
        return;
      }
  
      try {
        const response = await fetch(
          `http://localhost:5000/ticket?utilisateur_id=${user.id}&role=${user.role}`
        );
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
        } else {
          console.error('Erreur lors de la récupération des tickets.');
        }
      } catch (error) {
        console.error('Erreur réseau lors de la récupération des tickets:', error);
      }
    };
  
    fetchTickets();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error("Utilisateur non connecté");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titre,
          description,
          categorie,
          niveau_urgence: niveauUrgence,
          statut: 0, // Statut initial défini à 0
          utilisateur_id: user.id, // Inclure l'utilisateur connecté
        }),
      });

      if (response.ok) {
        const newTicket = await response.json();
        setTickets((prevTickets) => [...prevTickets, newTicket]);
        setSuccessMessage('Votre ticket a été envoyé avec succès.');
        setTitre('');
        setDescription('');
        setCategorie('bug');
        setNiveauUrgence('bas');
        setIsCreating(false); // Retour à l'historique après la création
      } else {
        console.error('Erreur lors de l\'envoi du ticket.');
      }
    } catch (error) {
      console.error('Erreur réseau lors de l\'envoi du ticket:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/ticket/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== id));
        console.log('Ticket supprimé avec succès.');
      } else {
        console.error('Erreur lors de la suppression du ticket.');
      }
    } catch (error) {
      console.error('Erreur réseau lors de la suppression du ticket:', error);
    }
  };

  return (
    <div className="ticket-container">
      {!isCreating ? (
        // Étape 1 : Historique des tickets
        <>
          <h1 className="ticket-title">Historique des Tickets</h1>
          {tickets.length === 0 ? (
            <div className="no-tickets">
              <p>Aucun ticket n'a encore été créé.</p>
              <button
                className="create-ticket-button"
                onClick={() => setIsCreating(true)}
              >
                Créer un Ticket
              </button>
            </div>
          ) : (
            <div className="ticket-list">
              {tickets.map((ticket) => (
                <div
                key={ticket.id}
                className={`ticket-item status-${ticket.statut}`} // Classe dynamique basée sur le statut
              >
                <h2 className="ticket-item-title">{ticket.titre}</h2>
                <p className="ticket-item-description">{ticket.description}</p>
                <p className="ticket-item-category">
                  <strong>Catégorie :</strong> {ticket.categorie}
                </p>
                <p className="ticket-item-urgency">
                  <strong>Niveau d'Urgence :</strong> {ticket.niveau_urgence}
                </p>
                <p className={`ticket-item-status status-${ticket.statut}`}>
                  <strong>Statut :</strong> {ticket.statut === 0 ? 'Non Résolu' : 'Résolu'}
                </p>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(ticket.id)}
                >
                  Supprimer
                </button>
              </div>
              ))}
              <button
                className="create-ticket-button"
                onClick={() => setIsCreating(true)}
              >
                Créer un Nouveau Ticket
              </button>
            </div>
          )}
        </>
      ) : (
        // Étape 2 : Création d'un ticket
        <>
          <h1 className="ticket-title">Créer un Ticket</h1>
          {successMessage && <p className="success-message">{successMessage}</p>}
          <form className="ticket-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="titre">Titre</label>
              <input
                id="titre"
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Entrez le sujet du ticket"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="categorie">Catégorie</label>
              <select
                id="categorie"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                required
              >
                <option value="bug">Bug</option>
                <option value="questions">Questions</option>
                <option value="problème">Problème</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="niveau_urgence">Niveau d'Urgence</label>
              <select
                id="niveau_urgence"
                value={niveauUrgence}
                onChange={(e) => setNiveauUrgence(e.target.value)}
                required
              >
                <option value="bas">Bas</option>
                <option value="moyen">Moyen</option>
                <option value="haut">Haut</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre problème ou question"
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-button">
              Envoyer le Ticket
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => setIsCreating(false)}
            >
              Annuler
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Ticket;