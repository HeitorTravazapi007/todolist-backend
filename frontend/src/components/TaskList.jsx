import { useState } from 'react';
import { CheckCircle2, Edit3, Trash2, MoreHorizontal, Check } from 'lucide-react';
import { formatDate, isOverdue } from '../utils/dateUtils';

export default function TaskList({ tasks, loading, onToggle, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Carregando tarefas...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center text-brand-500 dark:text-brand-400 mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhuma tarefa por aqui</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto">
          Que tal adicionar sua primeira tarefa?
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id} className="group relative">
          {editingId === task.id ? (
            <TaskItemEdit
              task={task}
              onSave={(updates) => {
                onUpdate(task.id, updates);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <TaskItem
              task={task}
              onToggle={() => onToggle(task)}
              onEdit={() => setEditingId(task.id)}
              onDelete={() => onDelete(task.id)}
            />
          )}
        </li>
      ))}
    </ul>
  );
}

function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const completed = task.completed === 1 || task.completed === true;
  const overdue = task.due_date && !completed && isOverdue(task.due_date);

  return (
    <div
      className={`rounded-2xl p-4 border border-border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all group relative overflow-hidden
        ${completed ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-800' : ''}`}
    >
      <div className="flex items-start gap-4">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={completed}
            onChange={onToggle}
            className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 text-brand-600 dark:text-brand-400 focus:ring-brand-500 cursor-pointer transition-colors"
            readOnly
          />
          <div className="w-5 h-5 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center">
            {completed && <Check className="w-3 h-3 text-brand-600 dark:text-brand-400" />}
          </div>
        </label>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <span
              className={`text-gray-900 dark:text-white text-sm font-medium leading-relaxed break-words ${
                completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
              }`}
            >
              {task.title}
            </span>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Editar tarefa"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                aria-label="Excluir tarefa"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {task.due_date && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className={`flex items-center gap-1 ${
                overdue ? 'text-red-500 font-semibold' : 'text-gray-500 dark:text-gray-400'
              }`}>
                {overdue ? '⚠' : '📅'}
                {formatDate(task.due_date)}
                {overdue ? ' • Atrasada' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {completed && (
        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-bold uppercase text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
            Concluída
          </span>
        </div>
      )}
    </div>
  );
}

function TaskItemEdit({ task, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.due_date || '');
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    const trimmed = title.trim();
    if (!trimmed) {
      setError('O título é obrigatório.');
      return;
    }
    if (trimmed.length < 3) {
      setError('O título precisa ter pelo menos 3 caracteres.');
      return;
    }
    if (trimmed.length > 255) {
      setError('O título não pode passar de 255 caracteres.');
      return;
    }
    if (dueDate && dueDate < new Date().toISOString().split('T')[0]) {
      setError('A data limite não pode ser anterior a hoje.');
      return;
    }

    const updates = {};
    if (trimmed !== task.title) updates.title = trimmed;
    if (dueDate !== (task.due_date || '')) updates.dueDate = dueDate || null;

    if (Object.keys(updates).length === 0) {
      onCancel();
      return;
    }

    await onSave(updates);
  };

  return (
    <div className="rounded-2xl p-4 border border-brand-200 dark:border-brand-800 bg-white dark:bg-gray-800 shadow-lg">
      <form onSubmit={handleSave} className="space-y-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength="255"
            className="w-full px-3 py-2 rounded-lg border border-border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Data limite</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none transition-all"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg border border-red-100 dark:border-red-500/20">
            <AlertCircleEdit className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 py-2 px-4 rounded-lg bg-brand-600 dark:bg-brand-500 text-white text-sm font-semibold hover:bg-brand-700 dark:hover:bg-brand-600 transition-colors"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-border text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

function AlertCircleEdit() {
  return (
    <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  );
}
