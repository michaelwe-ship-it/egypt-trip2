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
    <div className="w-full py-2 px-3 sm:px-4 bg-white/95 border-b border-slate-200">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          {CITIES.map((city) => {
            const isSelected = selectedCity === city.id;
            const count = counts ? counts[city.id] : undefined;

            return (
              <button
                key={city.id}
                onClick={() => onSelectCity(city.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold transition-all min-h-[38px] active:scale-[0.98] ${
                  isSelected
                    ? 'bg-white text-blue-700 font-bold shadow-xs ring-1 ring-blue-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span className="text-sm">{city.icon}</span>
                <span>{city.label}</span>
                {typeof count === 'number' && (
                  <span
                    className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isSelected
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-600'
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
    </div>
  );
};
