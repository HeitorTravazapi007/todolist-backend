import { useState, useEffect } from 'react';
import { Sun, Moon, Plus, Trash2, Edit3, CheckCircle2, RefreshCw } from 'lucide-react';
import { useTasks } from './hooks/useTasks';
import ThemeContext from './contexts/ThemeContext';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import StatsCards from './components/StatsCards';
import ProgressBar from './components/ProgressBar';
import Toast from './components/Toast';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [toast, setToast] = useState(null);

  const {
    tasks,
    loading,
    error,
    stats,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks(setToast);

  useEffect(() => {
    const saved = localStorage.getItem('todolist-theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(saved || (system ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreate = async (formData) => {
    try {
      await createTask(formData);
      setToast({ type: 'success', message: 'Tarefa criada com sucesso!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Erro ao criar tarefa.' });
    }
  };

  const handleToggle = async (task) => {
    try {
      await updateTask(task.id, { completed: !task.completed });
      setToast({ type: 'success', message: task.completed ? 'Tarefa reaberta.' : 'Tarefa concluída!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Erro ao atualizar tarefa.' });
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      await updateTask(id, updates);
      setToast({ type: 'success', message: 'Tarefa atualizada.' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Erro ao atualizar tarefa.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    try {
      await deleteTask(id);
      setToast({ type: 'success', message: 'Tarefa excluída.' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Erro ao excluir tarefa.' });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-brand-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-border/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-600 dark:bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Todolist</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Gerencie suas tarefas</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button
                  onClick={fetchTasks}
                  className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
                  aria-label="Atualizar lista"
                  disabled={loading}
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
              <Trash2 className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCards stats={stats} />
          </div>

          <div className="mb-6">
            <ProgressBar total={stats.total} completed={stats.completed} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <TaskForm onSubmit={handleCreate} loading={loading} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Suas tarefas ({tasks.length})
                  </h2>
                </div>
                <FilterBar />
              </div>

              <TaskList
                tasks={tasks}
                loading={loading}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </main>

        <footer className="border-t border-border/50 bg-white/50 dark:bg-gray-900/50 mt-12 py-6">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>Todolist • AtividadePW</span>
            <span>API: Fastify + MySQL</span>
          </div>
        </footer>

        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </ThemeContext.Provider>
  );
}
