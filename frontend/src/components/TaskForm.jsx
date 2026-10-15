import { useState, useRef } from 'react';
import { Plus, Clock } from 'lucide-react';
import { todayISO } from '../utils/dateUtils';

export default function TaskForm({ onSubmit, loading }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(todayISO());
  const [error, setError] = useState('');
  const titleRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmed = title.trim();
    if (!trimmed) {
      setError('O título é obrigatório.');
      titleRef.current?.focus();
      return;
    }
    if (trimmed.length < 3) {
      setError('O título precisa ter pelo menos 3 caracteres.');
      titleRef.current?.focus();
      return;
    }
    if (trimmed.length > 255) {
      setError('O título não pode passar de 255 caracteres.');
      titleRef.current?.focus();
      return;
    }
    if (dueDate && dueDate < todayISO()) {
      setError('A data limite não pode ser anterior a hoje.');
      return;
    }

    await onSubmit({ title: trimmed, dueDate: dueDate || null });
    setTitle('');
    setDueDate(todayISO());
  };

  return (
    <section className="rounded-2xl bg-white dark:bg-gray-800 border border-border p-6 shadow-lg">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
          <Plus className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Nova tarefa</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Adicione uma tarefa à sua lista</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="O que você precisa fazer?"
            maxLength="255"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data limite (opcional)</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={todayISO()}
              className="w-full pl-9 px-4 py-2.5 rounded-xl border border-border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-xl border border-red-100 dark:border-red-500/20">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-brand-600 dark:bg-brand-500 text-white font-semibold hover:bg-brand-700 dark:hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Criando...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Adicionar tarefa
            </>
          )}
        </button>
      </form>
    </section>
  );
}
