export default function StatsCards({ stats }) {
  const cards = [
    { label: 'Total', value: stats.total, color: 'brand', icon: '📋' },
    { label: 'Pendentes', value: stats.pending, color: 'warning', icon: '⏳' },
    { label: 'Concluídas', value: stats.completed, color: 'success', icon: '✅' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`rounded-2xl p-5 border border-border bg-white dark:bg-gray-800 shadow-sm`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl">{card.icon}</span>
            <span className="text-gray-400 dark:text-gray-500 text-sm">{card.color === 'brand' ? '📋' : ''}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
