import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register'; 
import RegisterItem from './pages/ItemRegistration'; 
import EditItem from './pages/EditItem';
import ViewItem from './pages/ViewItem';
import UserList from './pages/UserList';

// 🔐 ලොග් වී ඇත්දැයි බැලීමට ආරක්ෂිත Middleware එකක්
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // ටෝකන් එකක් නැත්නම් කෙලින්ම ලොගින් පිටුවට යවන්න
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. ලොගින් පිටුව - පද්ධතියට මුලින්ම එන කෙනෙකුට පෙනෙන පිටුව */}
        <Route path="/login" element={<Login />} />

        {/* 2. Dashboard එක - මෙය දැන් "/" පාරේ තිබුණත් ProtectedRoute නිසා ලොග් නොවී යා නොහැක */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* 3. අනෙකුත් සියලුම ආරක්ෂිත පිටු */}
        <Route path="/staff" element={
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        } />

        <Route path="/register" element={
          <ProtectedRoute>
            <Register />
          </ProtectedRoute>
        } />

        <Route path="/register-item" element={
          <ProtectedRoute>
            <RegisterItem />
          </ProtectedRoute>
        } />

        <Route path="/view/:id" element={
          <ProtectedRoute>
            <ViewItem />
          </ProtectedRoute>
        } />

        <Route path="/edit/:id" element={
          <ProtectedRoute>
            <EditItem />
          </ProtectedRoute>
        } />

        {/* 4. වැරදි URL එකක් ගැහුවොත් හෝ ලොග් නොවී ආවොත් ලොගින් පිටුවට යවන්න */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;