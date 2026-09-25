import React, { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Gamepad2, ShieldCheck, Key, Lock, Users, Server, ArrowRight, Sparkles, ExternalLink, Info } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const directOidcUrl = "http://localhost:8081/realms/cybersecurity/protocol/openid-connect/auth?client_id=fastapi-api&redirect_uri=http%3A%2F%2Flocalhost%3A5173&response_type=code&scope=openid%20profile%20email";

  const handleLogin = async () => {
    setLoading(true);
    try {
      await auth.signinRedirect();
    } catch (err) {
      console.error('OIDC Redirect error, fallback to direct URL:', err);
      window.location.href = directOidcUrl;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Soft background blue glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Main Glass Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 text-center">
          
          {/* Logo */}
          <div className="inline-flex p-4 rounded-2xl bg-playstation-blue text-white shadow-md mb-2">
            <Gamepad2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="font-display font-extrabold text-2xl tracking-tight text-slate-900">
              PlayStation Studios
            </h1>
            <p className="text-xs text-playstation-blue font-semibold flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Autenticación Centralizada LDAP + Keycloak OIDC</span>
            </p>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Inicia sesión para ingresar al Dashboard de videojuegos desarrollados por PlayStation. La autenticación valida usuarios LDAP en OpenLDAP a través de Keycloak y emite un Token JWT firmado por RS256.
          </p>

          {/* OIDC Login Buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-playstation-blue hover:bg-playstation-lightBlue text-white text-xs font-extrabold tracking-wide shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 group cursor-pointer disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              <span>{loading ? 'Redirigiendo a Keycloak...' : 'INICIAR SESIÓN CON LDAP / KEYCLOAK'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href={directOidcUrl}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center space-x-1.5 border border-slate-200"
            >
              <span>Enlace Directo a Realm Cybersecurity</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>

          {/* Notice Box */}
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-left text-[11px] text-slate-600 space-y-1">
            <p className="font-semibold text-playstation-blue flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Nota sobre la autenticación:
            </p>
            <p>
              Debes iniciar sesión desde esta pantalla. No intentes ingresar en la consola admin de <code>http://localhost:8081</code> directamente porque esa pertenece al realm <em>master</em>. Tus usuarios LDAP (<code>alice</code> y <code>bob</code>) pertenecen al realm <strong>cybersecurity</strong>.
            </p>
          </div>

          {/* LDAP Credentials Cheat Sheet */}
          <div className="pt-4 border-t border-slate-100 text-left space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-1 text-playstation-blue">
                <Users className="w-3.5 h-3.5" /> Credenciales LDAP de prueba:
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">OpenLDAP</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-playstation-blue/40 transition-all">
                <p className="text-slate-500 text-[10px]">Usuario 1:</p>
                <p className="text-slate-900 font-bold">alice</p>
                <p className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> alice123
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-playstation-blue/40 transition-all">
                <p className="text-slate-500 text-[10px]">Usuario 2:</p>
                <p className="text-slate-900 font-bold">bob</p>
                <p className="text-slate-500 text-[10px] flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> bob123
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Tech Badges */}
        <div className="flex items-center justify-center space-x-4 text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Server className="w-3.5 h-3.5 text-indigo-600" /> Docker Compose Stack
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-playstation-blue" /> React + oidc-client-ts
          </span>
        </div>

      </div>
    </div>
  );
};
