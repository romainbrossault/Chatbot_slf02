import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ManageTickets.css';

interface Ticket {
  id: number;
  titre: string;
  description: string;
  categorie: string;
  niveau_urgence: string;
  statut: number;
  utilisateur_nom: string;
  utilisateur_prenom: string;
}

const ManageTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:5000/ticket');
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

  const handleResolve = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/ticket/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: 1 }), // Mettre le statut à 1 (résolu)
      });

      if (response.ok) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === id ? { ...ticket, statut: 1 } : ticket
          )
        );
        console.log('Ticket marqué comme résolu.');
      } else {
        console.error('Erreur lors de la mise à jour du statut du ticket.');
      }
    } catch (error) {
      console.error('Erreur réseau lors de la mise à jour du statut du ticket:', error);
    }
  };

  return (
    <div className="manage-tickets-container">
      <button className="back-button" onClick={() => navigate('/admin')}>
        Retour
      </button>
      <h1 className="manage-tickets-title">Gestion des Tickets</h1>
      {tickets.length === 0 ? (
        <p className="no-tickets-message">Aucun ticket n'a été créé.</p>
      ) : (
        <div className="tickets-list">
          {tickets.map((ticket) => (
            <div
            key={ticket.id}
            className={`ticket-item status-${ticket.statut}`} // Classe dynamique basée sur le statut
          >
            <h2 className="ticket-title">{ticket.titre}</h2>
            <p className="ticket-description">{ticket.description}</p>
            <p className="ticket-category">
              <strong>Catégorie :</strong> {ticket.categorie}
            </p>
            <p className="ticket-urgency">
              <strong>Niveau d'Urgence :</strong> {ticket.niveau_urgence}
            </p>
            <p className="ticket-user">
              <strong>Utilisateur :</strong> {ticket.utilisateur_prenom} {ticket.utilisateur_nom}
            </p>
            <p className={`ticket-status status-${ticket.statut}`}>
              <strong>Statut :</strong> {ticket.statut === 0 ? 'Non Résolu' : 'Résolu'}
            </p>
            <label className="resolve-label">
              <input
                type="checkbox"
                disabled={ticket.statut === 1}
                onChange={() => handleResolve(ticket.id)}
              />
              Marquer comme résolu
            </label>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTickets;