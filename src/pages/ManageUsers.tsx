import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ManageUsers.css';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [updatedUser, setUpdatedUser] = useState<Partial<User>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/utilisateur');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error('Erreur lors de la récupération des utilisateurs.');
        }
      } catch (error) {
        console.error('Erreur réseau lors de la récupération des utilisateurs:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:5000/utilisateur/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        console.log('Utilisateur supprimé avec succès.');
      } else {
        console.error('Erreur lors de la suppression de l\'utilisateur.');
      }
    } catch (error) {
      console.error('Erreur réseau lors de la suppression de l\'utilisateur:', error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setUpdatedUser(user);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`http://localhost:5000/utilisateur/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUser.id ? { ...user, ...updatedUser } : user
          )
        );
        setEditingUser(null);
        setUpdatedUser({});
        console.log('Utilisateur mis à jour avec succès.');
      } else {
        console.error('Erreur lors de la mise à jour de l\'utilisateur.');
      }
    } catch (error) {
      console.error('Erreur réseau lors de la mise à jour de l\'utilisateur:', error);
    }
  };

  return (
    <div className="manage-users-container">
      <button className="back-button" onClick={() => navigate('/admin')}>
        Retour
      </button>
      <h1 className="manage-users-title">Gestion des Utilisateurs</h1>
      {users.length === 0 ? (
        <p className="no-users-message">Aucun utilisateur trouvé.</p>
      ) : (
        <div className="users-list">
          {users.map((user) => (
            <div key={user.id} className="user-item">
              {editingUser?.id === user.id ? (
                <div className="edit-user-form">
                  <input
                    type="text"
                    value={updatedUser.nom || ''}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, nom: e.target.value })}
                    placeholder="Nom"
                  />
                  <input
                    type="text"
                    value={updatedUser.prenom || ''}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, prenom: e.target.value })}
                    placeholder="Prénom"
                  />
                  <input
                    type="email"
                    value={updatedUser.email || ''}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                    placeholder="Email"
                  />
                  <select
                    value={updatedUser.role || ''}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, role: e.target.value })}
                  >
                    <option value="eleve">Élève</option>
                    <option value="enseignant">Enseignant</option>
                    <option value="admin">Administrateur</option>
                  </select>
                  <button onClick={handleUpdate}>Enregistrer</button>
                  <button onClick={() => setEditingUser(null)}>Annuler</button>
                </div>
              ) : (
                <>
                  <p><strong>Nom :</strong> {user.nom}</p>
                  <p><strong>Prénom :</strong> {user.prenom}</p>
                  <p><strong>Email :</strong> {user.email}</p>
                  <p><strong>Rôle :</strong> {user.role}</p>
                  <button onClick={() => handleEdit(user)}>Modifier</button>
                  <button onClick={() => handleDelete(user.id)}>Supprimer</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;