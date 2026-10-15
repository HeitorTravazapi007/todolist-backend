import { useState, useCallback } from 'react';
import { taskApi } from '../services/api';

export function useTasks(onToast) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskApi.list();
      setTasks(data.tasks || []);
      setStats({
        total: data.total || 0,
        completed: data.completed || 0,
        pending: (data.total || 0) - (data.completed || 0),
      });
    } catch (err) {
      setError(err.message);
      if (onToast) onToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  const createTask = useCallback(async (payload) => {
    setLoading(true);
    try {
      const created = await taskApi.create(payload);
      setTasks((prev) => [created, ...prev]);
      setStats((s) => ({ ...s, total: s.total + 1, pending: s.pending + 1 }));
      return created;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    setLoading(true);
    try {
      const updated = await taskApi.update(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    setLoading(true);
    try {
      await taskApi.remove(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setStats((s) => ({ ...s, total: Math.max(0, s.total - 1) }));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    stats,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}
