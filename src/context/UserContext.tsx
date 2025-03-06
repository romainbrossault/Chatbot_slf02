import React, { createContext, useState, useEffect } from 'react';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (newUser: User) => {
    if (user && user.id === newUser.id) {
      console.log("🔐 Utilisateur déjà connecté:", user);
      return;
    }
    console.log("🔐 Connexion réussie:", newUser);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    console.log("🚪 Déconnexion");
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};