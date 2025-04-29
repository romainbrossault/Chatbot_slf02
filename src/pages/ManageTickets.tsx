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
            <div key={ticket.id} className="ticket-item">
              <h2 className="ticket-title">{ticket.titre}</h2>
              <p className="ticket-description">{ticket.description}</p>
              <p className="ticket-category">
                <strong>Catégorie :</strong> {ticket.categorie}
              </p>
              <p className="ticket-urgency">
                <strong>Niveau d'Urgence :</strong> {ticket.niveau_urgence}
              </p>
              <p className="ticket-status">
                <strong>Statut :</strong> {ticket.statut === 0 ? 'Non Ouvert' : 'Fermé'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTickets;