import React, { useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { Game, GameCreateInput } from '../types';
import { fetchGames, createGame, deleteGame, logJwtEvent } from '../services/api';
import { GameCard } from '../components/GameCard';
import { AddGameModal } from '../components/AddGameModal';
import { Gamepad2, Plus, Search, Filter, ShieldCheck, RefreshCw, Sparkles, Layers, Cpu } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const auth = useAuth();
  const token = auth.user?.access_token;

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loadGames = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      logJwtEvent('API_REQUEST', 'Obteniendo listado de videojuegos desde FastAPI /api/games', token);
      const data = await fetchGames(token);
      setGames(data);
    } catch (err: any) {
      console.error('Error fetching games:', err);
      setError(err.message || 'Error al conectar con la API de FastAPI');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, [token]);

  const handleAddGame = async (newGameInput: GameCreateInput) => {
    if (!token) return;
    logJwtEvent('API_REQUEST', `Inyectando JWT en POST /api/games para agregar '${newGameInput.title}'`, token);
    const created = await createGame(token, newGameInput);
    setGames((prev) => [created, ...prev]);
  };

  const handleDeleteGame = async (gameId: number) => {
    if (!token) return;
    if (!window.confirm('¿Estás seguro de eliminar este videojuego?')) return;
    try {
      logJwtEvent('API_REQUEST', `Eliminando juego ID #${gameId} con JWT Authorization Header`, token);
      await deleteGame(token, gameId);
      setGames((prev) => prev.filter((g) => g.id !== gameId));
    } catch (err: any) {
      alert('Error al eliminar juego: ' + err.message);
    }
  };

  const genres = ['Todos', ...Array.from(new Set(games.map((g) => g.genre)))];

  const filteredGames = games.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.developer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'Todos' || game.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-8 pb-24">
      
      {/* Hero Banner / Header */}
      <div className="relative bg-white rounded-3xl p-6 lg:p-8 overflow-hidden border border-slate-200 shadow-sm">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-50/80 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-playstation-blue border border-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Catálogo Exclusivo PlayStation Studios</span>
            </div>
            <h1 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight text-slate-900">
              Dashboard de Videojuegos desarrollados por PlayStation
            </h1>
            <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">
              Peticiones autenticadas mediante <strong className="text-playstation-blue font-mono font-bold">Bearer Token (JWT OIDC)</strong>. Los elementos se persisten en tiempo real en la base de datos backend.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-playstation-blue hover:bg-playstation-lightBlue text-white text-xs font-extrabold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>AGREGAR JUEGO AL DASHBOARD</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 mt-6 border-t border-slate-100">
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block font-medium">Total de Juegos</span>
            <span className="text-xl font-extrabold text-slate-900 font-display flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-playstation-blue" /> {games.length}
            </span>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block font-medium">Usuario Autenticado</span>
            <span className="text-xs font-extrabold text-emerald-700 font-mono truncate block flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" /> {auth.user?.profile?.preferred_username || 'LDAP User'}
            </span>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block font-medium">Proveedor de Identidad</span>
            <span className="text-xs font-bold text-indigo-700 font-mono flex items-center gap-1">
              <Layers className="w-4 h-4 text-indigo-600" /> Keycloak + LDAP
            </span>
          </div>

          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block font-medium">Plataforma Objetivo</span>
            <span className="text-xs font-bold text-playstation-blue font-mono flex items-center gap-1">
              <Cpu className="w-4 h-4" /> PlayStation 5 / PS4
            </span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Genre Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar juego, estudio o género..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-playstation-blue transition-all shadow-sm"
          />
        </div>

        {/* Genre Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
          {genres.slice(0, 5).map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-playstation-blue text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <RefreshCw className="w-8 h-8 text-playstation-blue animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-mono">Cargando catálogo con JWT Bearer Token...</p>
        </div>
      ) : error ? (
        <div className="py-12 px-6 text-center space-y-4 bg-white rounded-3xl border border-rose-200 shadow-sm">
          <p className="text-sm font-bold text-rose-600">{error}</p>
          <button
            onClick={loadGames}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-xs font-bold text-white rounded-xl shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Reintentar Petición JWT
          </button>
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <Gamepad2 className="w-12 h-12 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-700">No se encontraron juegos que coincidan</p>
          <p className="text-xs text-slate-500">Prueba con otra búsqueda o agrega un nuevo juego con la ventana modal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} onDelete={handleDeleteGame} />
          ))}
        </div>
      )}

      {/* Add Game Modal */}
      <AddGameModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddGame={handleAddGame}
      />

    </div>
  );
};
