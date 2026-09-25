import React, { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { jwtDecode } from 'jwt-decode';
import { fetchProfile, logJwtEvent } from '../services/api';
import { UserProfile } from '../types';
import { Key, ShieldCheck, Clock, Server, CheckCircle2, Copy, RefreshCw, Layers, Lock, Cpu } from 'lucide-react';

export const TokenInspectorPage: React.FC = () => {
  const auth = useAuth();
  const token = auth.user?.access_token;

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  let decodedHeader: any = null;
  let decodedPayload: any = null;

  if (token) {
    try {
      decodedPayload = jwtDecode(token);
      const parts = token.split('.');
      if (parts.length === 3) {
        decodedHeader = JSON.parse(atob(parts[0]));
      }
    } catch (e) {
      console.error('Error decoding JWT:', e);
    }
  }

  const handleTestBackendToken = async () => {
    if (!token) return;
    setLoading(true);
    try {
      logJwtEvent('API_REQUEST', 'Verificando validez de JWT con backend FastAPI /api/profile', token);
      const data = await fetchProfile(token);
      setProfileData(data);
    } catch (err: any) {
      alert('Error en verificación de token: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-24">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-blue-50/80 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-playstation-blue border border-blue-200 text-xs font-semibold">
              <Key className="w-3.5 h-3.5" />
              <span>Inspector OIDC & JWT Bearer Token</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-slate-900">
              Análisis y Verificación de Tokens OIDC
            </h1>
            <p className="text-xs text-slate-600">
              Página dedicada integrada con <strong className="text-playstation-blue font-bold">react-oidc-context</strong> y <strong className="text-playstation-blue font-bold">oidc-client-ts</strong> para la inspección profunda de credenciales LDAP.
            </p>
          </div>

          <button
            onClick={handleTestBackendToken}
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-playstation-blue hover:bg-playstation-lightBlue text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 shrink-0 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Server className="w-4 h-4 text-blue-200" />
            )}
            <span>Probar Token en FastAPI (/api/profile)</span>
          </button>
        </div>
      </div>

      {/* Backend Test Response Card */}
      {profileData && (
        <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-200 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Respuesta del Backend (JWT Válido & Aceptado):</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
              HTTP 200 OK
            </span>
          </div>
          <pre className="text-xs font-mono text-emerald-900 bg-white p-4 rounded-2xl border border-emerald-200 overflow-x-auto shadow-inner">
            {JSON.stringify(profileData, null, 2)}
          </pre>
        </div>
      )}

      {/* Token Properties & Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Keycloak Session State */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-playstation-blue">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="font-bold text-sm text-slate-900">Estado de Sesión Keycloak</h3>
          </div>
          <div className="space-y-2 text-xs font-mono text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Estado OIDC:</span>
              <span className="text-emerald-600 font-bold">Autenticado</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Tipo Token:</span>
              <span className="text-slate-800 font-semibold">{auth.user?.token_type || 'Bearer'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Scope:</span>
              <span className="text-slate-800 font-semibold">{auth.user?.scope}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Expiración (Seg):</span>
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> {auth.user?.expires_in}s
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: LDAP User Claims */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-indigo-600">
            <Layers className="w-6 h-6" />
            <h3 className="font-bold text-sm text-slate-900">Claims de Usuario LDAP</h3>
          </div>
          <div className="space-y-2 text-xs font-mono text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">preferred_username:</span>
              <span className="text-playstation-blue font-bold">{decodedPayload?.preferred_username}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">email:</span>
              <span className="text-slate-800 font-semibold">{decodedPayload?.email || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">sub:</span>
              <span className="text-slate-600 text-[10px] truncate max-w-[140px]">{decodedPayload?.sub}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">aud (Audience):</span>
              <span className="text-slate-800 font-semibold">{String(decodedPayload?.aud)}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Security & Encryption */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-purple-600">
            <Lock className="w-6 h-6" />
            <h3 className="font-bold text-sm text-slate-900">Cifrado y Firma RS256</h3>
          </div>
          <div className="space-y-2 text-xs font-mono text-slate-700">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Algoritmo (alg):</span>
              <span className="text-purple-600 font-bold">{decodedHeader?.alg || 'RS256'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Key ID (kid):</span>
              <span className="text-slate-600 text-[10px] truncate max-w-[140px]">{decodedHeader?.kid || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Emisor (iss):</span>
              <span className="text-slate-700 text-[10px] truncate max-w-[140px]">{decodedPayload?.iss}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">PKCE Method:</span>
              <span className="text-emerald-600 font-bold">S256</span>
            </div>
          </div>
        </div>

      </div>

      {/* Raw JWT Token Explorer */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-playstation-blue" />
            <h3 className="font-bold text-sm text-slate-900">Codificación JWT Token Completa (Access Token)</h3>
          </div>
          {token && (
            <button
              onClick={() => copyToClipboard(token)}
              className="flex items-center space-x-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Token Completo'}</span>
            </button>
          )}
        </div>

        {token ? (
          <div className="p-4 rounded-2xl bg-slate-900 font-mono text-xs break-all leading-relaxed select-all text-slate-200 shadow-inner">
            <span className="text-rose-400">{token.split('.')[0]}</span>
            <span className="text-slate-500">.</span>
            <span className="text-blue-400">{token.split('.')[1]}</span>
            <span className="text-slate-500">.</span>
            <span className="text-emerald-400">{token.split('.')[2]}</span>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No hay token disponible.</p>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 font-mono font-medium">
          <span className="text-rose-600 font-semibold">■ Encabezado (Header)</span>
          <span className="text-playstation-blue font-semibold">■ Carga útil (Payload / Claims LDAP)</span>
          <span className="text-emerald-600 font-semibold">■ Firma Criptográfica (Signature)</span>
        </div>
      </div>

    </div>
  );
};
