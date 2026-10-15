import { useState } from 'react';
import { Search, List, Clock, CheckCircle } from 'lucide-react';

const filters = [
  { value: 'all', label: 'Todas', icon: List },
  { value: 'pending', label: 'Pendentes', icon: Clock },
  { value: 'completed', label: 'Concluídas', icon: CheckCircle },
];

export default function FilterBar() {
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Buscar tarefas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.value}
              onClick={() => setStatus(filter.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                status === filter.value
                  ? 'bg-brand-600 dark:bg-brand-500 text-white shadow-md shadow-brand-500/30'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
