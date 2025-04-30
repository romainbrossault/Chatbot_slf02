import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home/Home';
import Chats from './pages/Chats/Chats';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import RGPD from './pages/RGPD'; 
import Admin from './pages/Admin/Admin';
import UserGuide from './pages/UserGuide/UserGuide';
import Account from './pages/Account/Account';
import ManageTheme from './pages/ManageTheme/ManageTheme';
import AdminKnowledge from './pages/AdminKnowLedge/AdminKnowLedge';
import Ticket from './pages/Ticket/Ticket';
import ManageTickets from './pages/ManageTickets/ManageTickets'; 
import ManageUsers from './pages/ManageUsers/ManageUsers'; 
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
              <Route path="/rgpd" element={<RGPD/>} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/guide" element={<UserGuide />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin-knowledge" element={<AdminKnowledge />} />
              <Route path="/manage-theme" element={<ManageTheme />} />
              <Route path="/ticket" element={<Ticket />} />
              <Route path="/manage-tickets" element={<ManageTickets />} /> 
              <Route path="/manage-users" element={<ManageUsers />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;