import React, { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import BankingConsultancy from "./pages/BankingConsultancy";
import Property from "./pages/Property";
import TaxFiling from "./pages/TaxFiling";
import PersonalFinance from "./pages/PersonalFinance";
import AIAdvisor from "./pages/AIAdvisor";
import { Toaster } from "@/components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AuthContext = React.createContext();

function AuthWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuth = async () => {
      // Check for session_id in URL fragment
      const hash = window.location.hash;
      if (hash.includes('session_id=')) {
        const sessionId = hash.split('session_id=')[1].split('&')[0];
        
        try {
          const response = await axios.post(`${API}/auth/session`, {
            session_id: sessionId
          }, { withCredentials: true });
          
          if (response.data.success) {
            setUser(response.data.user);
            // Clean URL
            window.location.hash = '';
            navigate('/dashboard', { replace: true });
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
        setLoading(false);
        return;
      }

      // Check existing session
      try {
        const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
        setUser(response.data);
      } catch (error) {
        // Not authenticated
      }
      setLoading(false);
    };

    handleAuth();
  }, [navigate]);

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthWrapper>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/banking" element={
              <ProtectedRoute>
                <BankingConsultancy />
              </ProtectedRoute>
            } />
            <Route path="/property" element={
              <ProtectedRoute>
                <Property />
              </ProtectedRoute>
            } />
            <Route path="/tax" element={
              <ProtectedRoute>
                <TaxFiling />
              </ProtectedRoute>
            } />
            <Route path="/finance" element={
              <ProtectedRoute>
                <PersonalFinance />
              </ProtectedRoute>
            } />
            <Route path="/ai-advisor" element={
              <ProtectedRoute>
                <AIAdvisor />
              </ProtectedRoute>
            } />
          </Routes>
          <Toaster position="top-right" />
        </AuthWrapper>
      </BrowserRouter>
    </div>
  );
}

export default App;
