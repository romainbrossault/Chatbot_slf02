import React, { useState, useEffect } from 'react';

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
      className={`theme-toggle-button ${isDarkMode ? 'dark-mode' : ''}`}
      onClick={toggleTheme}
    >
      {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
    </button>
  );
};

export default Theme;