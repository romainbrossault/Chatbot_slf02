import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chats from './pages/Chats';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import UserGuide from './pages/UserGuide';
import Account from './pages/Account';
import ManageTheme from './pages/ManageTheme';
import AdminKnowledge from './pages/AdminKnowledge';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/guide" element={<UserGuide />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin-knowledge" element={<AdminKnowledge />} />
              <Route path="/manage-theme" element={<ManageTheme />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;