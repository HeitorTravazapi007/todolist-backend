export default function ProgressBar({ total, completed }) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="rounded-2xl p-5 border border-border bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Progresso</h3>
        <span className={`text-sm font-bold ${percent >= 100 ? 'text-green-600 dark:text-green-400' : 'text-brand-600 dark:text-brand-400'}`}>
          {percent}% concluído
        </span>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            percent >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-brand-500 to-green-400'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
        <span>{completed} de {total} tarefas</span>
        <span>{total > 0 ? total - completed : 0} pendente{total - completed !== 1 ? 's' : ''}</span>
      </div>
    </section>
  );
}
