import React, { useState, useEffect } from 'react';
import '../styles/Ticket.css';

interface Ticket {
  id: number;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: string;
}

const Ticket: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]); // Historique des tickets
  const [isCreating, setIsCreating] = useState(false); // État pour basculer entre l'historique et la création
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('bug');
  const [urgency, setUrgency] = useState('bas');
  const [status, setStatus] = useState('envoyé'); // Statut initial du ticket
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Charger les tickets existants
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:5000/tickets');
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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          urgency,
          status,
        }),
      });

      if (response.ok) {
        const newTicket = await response.json();
        setTickets((prevTickets) => [...prevTickets, newTicket]);
        setSuccessMessage('Votre ticket a été envoyé avec succès.');
        setTitle('');
        setDescription('');
        setCategory('bug');
        setUrgency('bas');
        setStatus('envoyé');
        setIsCreating(false); // Retour à l'historique après la création
      } else {
        console.error('Erreur lors de l\'envoi du ticket.');
      }
    } catch (error) {
      console.error('Erreur réseau lors de l\'envoi du ticket:', error);
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
                <div key={ticket.id} className="ticket-item">
                  <h2 className="ticket-item-title">{ticket.title}</h2>
                  <p className="ticket-item-description">{ticket.description}</p>
                  <p className="ticket-item-category">
                    <strong>Catégorie :</strong> {ticket.category}
                  </p>
                  <p className="ticket-item-urgency">
                    <strong>Urgence :</strong> {ticket.urgency}
                  </p>
                  <p className={`ticket-item-status status-${ticket.status}`}>
                    <strong>Statut :</strong> {ticket.status}
                  </p>
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
              <label htmlFor="title">Titre</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entrez le sujet du ticket"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Catégorie</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="bug">Bug</option>
                <option value="questions">Questions</option>
                <option value="problème">Problème</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="urgency">Niveau d'Urgence</label>
              <select
                id="urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
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