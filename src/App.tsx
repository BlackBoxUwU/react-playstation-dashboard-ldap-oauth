import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TokenInspectorPage } from './pages/TokenInspectorPage';
import { JwtLoggerViewer } from './components/JwtLoggerViewer';
import { RefreshCw, AlertTriangle, Gamepad2 } from 'lucide-react';

const MainLayout: React.FC = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-md">
          <Gamepad2 className="w-10 h-10 text-playstation-blue animate-pulse" />
        </div>
        <div className="flex items-center space-x-2 text-slate-600 text-xs font-mono">
          <RefreshCw className="w-4 h-4 animate-spin text-playstation-blue" />
          <span>Verificando sesión LDAP / Keycloak OIDC...</span>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-rose-200 shadow-xl max-w-md text-center space-y-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl inline-block">
            <AlertTriangle className="w-8 h-8 mx-auto" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Error de Autenticación OIDC</h2>
          <p className="text-xs text-rose-600 font-medium">{auth.error.message}</p>
          <button
            onClick={() => auth.signinRedirect()}
            className="px-5 py-2.5 bg-playstation-blue hover:bg-playstation-lightBlue text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            Reintentar Login LDAP
          </button>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 pt-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/token-inspector" element={<TokenInspectorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <JwtLoggerViewer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}
