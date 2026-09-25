import React, { useState } from 'react';
import { GameCreateInput } from '../types';
import { X, Plus, Sparkles, Gamepad, Image, Star, ShieldCheck, AlertCircle } from 'lucide-react';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: GameCreateInput) => Promise<void>;
}

const PRESET_SUGGESTIONS: GameCreateInput[] = [
  {
    title: "Gran Turismo 7",
    developer: "Polyphony Digital",
    release_year: 2022,
    genre: "Simulador de Carreras",
    platform: "PlayStation 5",
    rating: 4.8,
    cover_url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
    description: "La experiencia de conducción definitiva en PS5 con gráficos 4K fotorrealistas y soporte para PlayStation VR2."
  },
  {
    title: "Returnal",
    developer: "Housemarque",
    release_year: 2021,
    genre: "Roguelike / Shooter Sci-Fi",
    platform: "PlayStation 5",
    rating: 4.7,
    cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    description: "Tras un aterrizaje forzoso en un mundo alienígena cambiante, Selene debe luchar con uñas y dientes para salir con vida."
  },
  {
    title: "Death Stranding 2: On The Beach",
    developer: "Kojima Productions",
    release_year: 2025,
    genre: "Acción / Aventura",
    platform: "PlayStation 5",
    rating: 5.0,
    cover_url: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=800&q=80",
    description: "Embárcate en una misión inspiradora de conexión humana más allá de la UCA junto a Sam Porter Bridges."
  }
];

export const AddGameModal: React.FC<AddGameModalProps> = ({ isOpen, onClose, onAddGame }) => {
  const [formData, setFormData] = useState<GameCreateInput>({
    title: '',
    developer: '',
    release_year: 2024,
    genre: 'Acción / Aventura',
    platform: 'PlayStation 5',
    rating: 4.9,
    cover_url: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.developer || !formData.cover_url || !formData.description) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await onAddGame(formData);
      onClose();
      setFormData({
        title: '',
        developer: '',
        release_year: 2024,
        genre: 'Acción / Aventura',
        platform: 'PlayStation 5',
        rating: 4.9,
        cover_url: '',
        description: '',
      });
    } catch (err: any) {
      setError(err.message || 'Error al guardar el videojuego con JWT Bearer Token');
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (preset: GameCreateInput) => {
    setFormData(preset);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-modal border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-playstation-blue text-white shadow-sm">
              <Gamepad className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Agregar Nuevo Juego de PlayStation</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 font-mono font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Protected API
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Se enviará una petición POST validando el JWT Bearer Token LDAP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets section */}
        <div className="px-5 py-3 bg-blue-50/50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs font-semibold text-playstation-blue flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5" /> Presets Rápidos:
          </span>
          {PRESET_SUGGESTIONS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-xs bg-white hover:bg-playstation-blue hover:text-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition-all shadow-sm whitespace-nowrap cursor-pointer"
            >
              + {preset.title}
            </button>
          ))}
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título del Juego *</label>
              <input
                type="text"
                placeholder="Ej. Demon's Souls"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-playstation-blue focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Estudio / Desarrollador *</label>
              <input
                type="text"
                placeholder="Ej. Bluepoint Games"
                value={formData.developer}
                onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-playstation-blue focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Año de Lanzamiento *</label>
              <input
                type="number"
                min="1994"
                max="2030"
                value={formData.release_year}
                onChange={(e) => setFormData({ ...formData, release_year: parseInt(e.target.value) || 2024 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-playstation-blue focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Género *</label>
              <input
                type="text"
                placeholder="Ej. Action RPG, Carrera"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-playstation-blue focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Plataforma *</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-playstation-blue focus:bg-white transition-all"
              >
                <option value="PlayStation 5">PlayStation 5</option>
                <option value="PlayStation 4 / PS5">PlayStation 4 / PS5</option>
                <option value="PlayStation VR2">PlayStation VR2</option>
                <option value="PlayStation Classic">PlayStation Classic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Calificación (0 - 5)</span>
                <span className="text-amber-500 font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400" /> {formData.rating.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                className="w-full accent-playstation-blue cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-playstation-blue" /> URL de Imagen de Portada *
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={formData.cover_url}
              onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-playstation-blue focus:bg-white transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción del Juego *</label>
            <textarea
              rows={3}
              placeholder="Escribe un breve resumen de la historia o características del juego..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-playstation-blue focus:bg-white transition-all resize-none"
              required
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-playstation-blue hover:bg-playstation-lightBlue shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Guardando...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Guardar con JWT Bearer Token</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
