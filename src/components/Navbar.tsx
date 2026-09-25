import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Gamepad2, ShieldCheck, Key, LogOut, LayoutDashboard, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const auth = useAuth();
  const location = useLocation();

  const username = auth.user?.profile?.preferred_username || auth.user?.profile?.name || 'Usuario LDAP';
  const email = auth.user?.profile?.email || 'ldap.user@example.com';

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="bg-playstation-blue p-2.5 rounded-xl text-white shadow-md flex items-center justify-center">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-display font-bold text-xl tracking-tight text-slate-900">
                PlayStation Studios
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-playstation-blue border border-blue-200">
                LDAP + OIDC
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Cybersecurity Lab Dashboard</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <Link
            to="/"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/'
                ? 'bg-playstation-blue text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/token-inspector"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              location.pathname === '/token-inspector'
                ? 'bg-playstation-blue text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Inspector JWT</span>
          </Link>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-3 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-playstation-blue text-white flex items-center justify-center font-bold text-xs shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1">
                <span>{username}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
              </p>
              <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{email}</p>
            </div>
          </div>

          <button
            onClick={() => auth.removeUser()}
            title="Cerrar Sesión Keycloak LDAP"
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>

      </div>
    </nav>
  );
};
