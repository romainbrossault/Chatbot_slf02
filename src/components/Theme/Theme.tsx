import React, { useState, useEffect } from 'react';
import moonIcon from '../../img/moon.png'; // Icône pour le mode clair
import sunIcon from '../../img/sun.png'; // Icône pour le mode sombre
import './styles/Theme.css';

const Theme: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Ajouter ou supprimer la classe "dark-mode" sur le body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <button
      className="theme-toggle-button"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >
      <img
        src={isDarkMode ? moonIcon : sunIcon }
        alt={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        className="theme-icon"
      />
    </button>
  );
};

export default Theme;