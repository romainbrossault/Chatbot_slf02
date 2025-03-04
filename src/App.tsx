import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chats from './pages/Chats';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import UserGuide from './pages/UserGuide';

function App() {
  return (
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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;