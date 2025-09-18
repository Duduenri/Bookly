import { toaster } from '@/src/components/ui/toaster';

interface ToastOptions {
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading';
  duration?: number;
}

export const useToast = () => {
  const showToast = ({ title, description, type = 'info', duration = 5000 }: ToastOptions) => {
    return toaster.create({
      title,
      description,
      type,
      duration,
    });
  };

  const success = (title: string, description?: string) => {
    return showToast({ title, description, type: 'success' });
  };

  const error = (title: string, description?: string) => {
    return showToast({ title, description, type: 'error' });
  };

  const warning = (title: string, description?: string) => {
    return showToast({ title, description, type: 'warning' });
  };

  const info = (title: string, description?: string) => {
    return showToast({ title, description, type: 'info' });
  };

  const loading = (title: string, description?: string) => {
    return showToast({ title, description, type: 'loading', duration: undefined });
  };

  return {
    showToast,
    success,
    error,
    warning,
    info,
    loading,
  };
};