import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserContext } from '../../context/UserContext';
import './styles/Admin.css';

const Admin: React.FC = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Redirection si l'utilisateur n'est pas administrateur
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/'); // Redirige vers la page d'accueil
    }
  }, [user, navigate]);

  return (
    <motion.div
      className="admin-container"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.h1
        className="admin-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Interface Administrateur
      </motion.h1>
      <motion.div
        className="admin-buttons"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.button
          className="admin-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/admin-knowledge')}
        >
          Base Connaissance
        </motion.button>
        <motion.button
          className="admin-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/manage-tickets')}
        >
          Gestion Tickets
        </motion.button>
        <motion.button
          className="admin-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/manage-users')}
        >
          Gestion Utilisateur
        </motion.button>
        <motion.button
          className="admin-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/questions-non-comprises')}
        >
          Questions non comprises
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Admin;