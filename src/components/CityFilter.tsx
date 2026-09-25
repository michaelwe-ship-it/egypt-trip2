import React from 'react';
import { City } from '../types/travel';
import { MapPin, Compass } from 'lucide-react';

interface CityFilterProps {
  selectedCity: City;
  onSelectCity: (city: City) => void;
  counts?: Record<City, number>;
}

export const CITIES: { id: City; label: string; enName: string; icon: string }[] = [
  { id: 'ALL', label: '전체', enName: 'All Cities', icon: '📍' },
  { id: 'CAIRO', label: '카이로', enName: 'Cairo', icon: '🏜️' },
  { id: 'LUXOR', label: '룩소르', enName: 'Luxor', icon: '🏛️' },
];

export const CityFilter: React.FC<CityFilterProps> = ({
  selectedCity,
  onSelectCity,
  counts,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2.5 px-4 bg-white/90 border-b border-slate-200">
      <div className="flex items-center gap-2 min-w-max max-w-4xl mx-auto">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          도시
        </span>
        {CITIES.map((city) => {
          const isSelected = selectedCity === city.id;
          const count = counts ? counts[city.id] : undefined;

          return (
            <button
              key={city.id}
              onClick={() => onSelectCity(city.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white font-bold shadow-xs ring-1 ring-blue-600'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <span>{city.icon}</span>
              <span>{city.label}</span>
              <span className={`text-[10px] ${isSelected ? 'text-blue-100 font-medium' : 'text-slate-400'}`}>
                ({city.enName})
              </span>
              {typeof count === 'number' && (
                <span
                  className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? 'bg-blue-700 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
