import React from 'react';
import { Users, MessageSquare, AlertTriangle } from 'lucide-react';
import '../styles/Admin.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const Admin: React.FC = () => {
  // Mock data for users
  const users: User[] = [
    { id: 1, name: 'Jean Dupont', email: 'jean@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Marie Martin', email: 'marie@example.com', role: 'User', status: 'active' },
    { id: 3, name: 'Pierre Durand', email: 'pierre@example.com', role: 'User', status: 'inactive' },
  ];

  return (
    <div className="admin-container">
      <h1 className="admin-title">Interface Administrateur</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon-container users-icon-bg">
              <Users className="stat-icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Utilisateurs</p>
              <p className="stat-value">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon-container chats-icon-bg">
              <MessageSquare className="stat-icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Conversations</p>
              <p className="stat-value">24</p>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-icon-container issues-icon-bg">
              <AlertTriangle className="stat-icon" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Problèmes</p>
              <p className="stat-value">2</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="users-table-container">
        <div className="table-header">
          <h2 className="table-title">Gestion des utilisateurs</h2>
        </div>
        <div className="table-container">
          <table className="users-table">
            <thead className="table-head">
              <tr>
                <th className="table-header-cell">Nom</th>
                <th className="table-header-cell">Email</th>
                <th className="table-header-cell">Rôle</th>
                <th className="table-header-cell">Statut</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {users.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">
                    <div className="user-name">{user.name}</div>
                  </td>
                  <td className="table-cell">
                    <div className="user-email">{user.email}</div>
                  </td>
                  <td className="table-cell">
                    <div className="user-role">{user.role}</div>
                  </td>
                  <td className="table-cell">
                    <span className={`status-badge ${
                      user.status === 'active' ? 'status-active' : 'status-inactive'
                    }`}>
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="table-cell action-buttons">
                    <button className="edit-button">Modifier</button>
                    <button className="delete-button">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;