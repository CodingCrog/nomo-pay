import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />
  };

  const backgrounds = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md w-full animate-slide-in ${isVisible ? 'animate-slide-in' : 'animate-slide-out'}`}>
      <div className={`rounded-lg border p-4 shadow-lg ${backgrounds[type]}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {title}
            </h3>
            {message && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Notification Manager
interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

class NotificationManager {
  private listeners: Set<(notification: NotificationData) => void> = new Set();

  subscribe(callback: (notification: NotificationData) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  show(type: NotificationType, title: string, message?: string, duration?: number) {
    const notification: NotificationData = {
      id: Date.now().toString(),
      type,
      title,
      message,
      duration
    };
    this.listeners.forEach(listener => listener(notification));
  }

  success(title: string, message?: string) {
    this.show('success', title, message);
  }

  error(title: string, message?: string) {
    this.show('error', title, message);
  }

  warning(title: string, message?: string) {
    this.show('warning', title, message);
  }

  info(title: string, message?: string) {
    this.show('info', title, message);
  }
}

export const notificationManager = new NotificationManager();

// Hook to use notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe((notification) => {
      setNotifications(prev => [...prev, notification]);
    });
    return unsubscribe;
  }, []);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return { notifications, removeNotification };
};

// NotificationContainer to render all notifications
export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};