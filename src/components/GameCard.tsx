import React from 'react';
import { Game } from '../types';
import { Star, Calendar, User, Trash2, Cpu, Tag } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onDelete?: (id: number) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onDelete }) => {
  return (
    <div className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-cardHover hover:border-playstation-blue/30 transition-all duration-300 flex flex-col h-full">
      {/* Cover Image container */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={game.cover_url}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Rating badge */}
        <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold shadow-md border border-slate-200">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{game.rating.toFixed(1)}</span>
        </div>

        {/* Platform tag */}
        <div className="absolute top-3 left-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-playstation-blue/90 backdrop-blur-md text-white text-[11px] font-semibold shadow-md">
          <Cpu className="w-3 h-3 text-blue-200" />
          <span>{game.platform}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-playstation-blue font-semibold">
            <span className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              <Tag className="w-3 h-3" />
              {game.genre}
            </span>
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Calendar className="w-3 h-3" />
              {game.release_year}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-playstation-blue transition-colors line-clamp-1">
            {game.title}
          </h3>

          <p className="text-xs text-slate-500 font-medium">
            Estudio: <span className="text-slate-800 font-semibold">{game.developer}</span>
          </p>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <User className="w-3.5 h-3.5 text-playstation-blue" />
            <span className="text-[11px] font-mono text-slate-700 font-medium">
              {game.added_by || 'LDAP Admin'}
            </span>
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(game.id)}
              title="Eliminar elemento"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
