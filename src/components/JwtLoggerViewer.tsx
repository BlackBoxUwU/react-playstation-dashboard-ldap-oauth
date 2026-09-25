import React, { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { jwtDecode } from 'jwt-decode';
import { JwtLogEntry } from '../types';
import { Terminal, Shield, ChevronUp, ChevronDown, Copy, Check, Info, Code } from 'lucide-react';

export const JwtLoggerViewer: React.FC = () => {
  const auth = useAuth();
  const [logs, setLogs] = useState<JwtLogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'console' | 'claims'>('console');

  const token = auth.user?.access_token;
  let decodedToken: any = null;

  if (token) {
    try {
      decodedToken = jwtDecode(token);
    } catch (e) {
      decodedToken = null;
    }
  }

  useEffect(() => {
    const handleLogEvent = (e: any) => {
      setLogs((prev) => [e.detail, ...prev.slice(0, 49)]);
    };

    window.addEventListener('jwt-log-event', handleLogEvent);
    return () => window.removeEventListener('jwt-log-event', handleLogEvent);
  }, []);

  useEffect(() => {
    if (token) {
      const time = new Date().toLocaleTimeString();
      const entry: JwtLogEntry = {
        id: Math.random().toString(36).substring(7),
        timestamp: time,
        type: 'TOKEN_RECEIVED',
        details: `Nuevo JWT Token OIDC recibido de Keycloak realm 'cybersecurity'`,
        tokenSnippet: `${token.substring(0, 25)}...${token.substring(token.length - 15)}`,
        fullToken: token,
      };
      setLogs((prev) => [entry, ...prev.slice(0, 49)]);
    }
  }, [token]);

  const copyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-2 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        
        {/* Toggle Bar */}
        <div className="bg-white border-t border-x border-slate-200 rounded-t-2xl px-4 py-2.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center space-x-2 text-xs font-mono font-bold text-playstation-blue hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-playstation-blue" />
              <span>Consola JWT & OIDC Logs ({logs.length})</span>
              {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>

            <span className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-600 font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>User: <strong className="text-slate-900">{auth.user?.profile?.preferred_username || 'Sin autenticar'}</strong></span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {token && (
              <button
                onClick={copyToken}
                className="flex items-center space-x-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{copied ? '¡Copiado!' : 'Copiar JWT Raw'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Drawer Body */}
        {isOpen && (
          <div className="bg-white border-b border-x border-slate-200 rounded-b-2xl p-4 shadow-xl h-72 flex flex-col transition-all">
            
            {/* Drawer Tabs */}
            <div className="flex items-center space-x-4 border-b border-slate-200 pb-2 mb-3">
              <button
                onClick={() => setActiveTab('console')}
                className={`text-xs font-semibold flex items-center space-x-1.5 pb-1 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'console'
                    ? 'border-playstation-blue text-playstation-blue'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Logs de Peticiones HTTP ({logs.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('claims')}
                className={`text-xs font-semibold flex items-center space-x-1.5 pb-1 border-b-2 transition-all cursor-pointer ${
                  activeTab === 'claims'
                    ? 'border-playstation-blue text-playstation-blue'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Info className="w-3.5 h-3.5" />
                <span>Decodificado JWT Payload (LDAP Claims)</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto font-mono text-[11px]">
              {activeTab === 'console' ? (
                <div className="space-y-1.5">
                  {logs.length === 0 ? (
                    <p className="text-slate-400 italic py-4 text-center">No hay peticiones registradas aún. Realiza una acción en el dashboard.</p>
                  ) : (
                    logs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 font-bold">[{log.timestamp}]</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              log.type === 'TOKEN_RECEIVED'
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                : log.type === 'API_REQUEST'
                                ? 'bg-blue-100 text-playstation-blue border border-blue-200'
                                : log.type === 'API_RESPONSE'
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-100 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {log.type}
                          </span>
                          <span className="text-slate-800 font-sans text-xs">{log.details}</span>
                        </div>

                        {log.tokenSnippet && (
                          <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-xs">
                            Bearer: {log.tokenSnippet}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {token ? (
                    <div>
                      <div className="mb-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-600 block text-[10px] font-sans font-bold mb-1">JWT Bearer Raw:</span>
                        <p className="text-playstation-blue break-all text-[10px] select-all font-mono">{token}</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 text-slate-100 border border-slate-800">
                        <span className="text-slate-400 block text-[10px] font-sans font-bold mb-1">Claims decodificados (JSON):</span>
                        <pre className="text-emerald-400 overflow-x-auto text-[10px]">
                          {JSON.stringify(decodedToken, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-400 italic py-4 text-center">No hay token JWT activo.</p>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
