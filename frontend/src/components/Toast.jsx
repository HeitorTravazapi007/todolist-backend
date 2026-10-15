import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icon = toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />;
  const bg = toast.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-800 dark:text-green-200' : 'bg-red-500/10 border-red-500/20 text-red-800 dark:text-red-200';

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl ${bg} animate-slide-in`}
      role="alert"
    >
      {icon}
      <p className="text-sm font-medium">{toast.message}</p>
      <button onClick={onClose} className="ml-auto p-1 hover:opacity-70 transition-opacity">
        <X className="w-4 h-5" />
      </button>
    </div>
  );
}
