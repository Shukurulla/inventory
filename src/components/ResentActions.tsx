// src/components/RecentActionsAPI.tsx
import { useState, useEffect } from "react";
import {
  Clock,
  Plus,
  X,
  Edit,
  ComputerIcon as Desktop,
  Loader2,
} from "lucide-react";
import { cn } from "../lib/utils";

interface RecentAction {
  id: string;
  name: string;
  category: string;
  type: string;
  time: string;
  created_at: string;
  user: string;
}

interface RecentActionsProps {
  className?: string;
}

export function RecentActionsAPI({ className }: RecentActionsProps) {
  const [actions, setActions] = useState<RecentAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const error = null;

  useEffect(() => {
    fetchRecentActions();

    // Set up polling to fetch new actions every 30 seconds
    const interval = setInterval(fetchRecentActions, 30000);

    return () => clearInterval(interval);
  }, []);
  console.log(actions);

  const fetchRecentActions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://invenmaster.pythonanywhere.com/inventory/equipment/my-actions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActions(data.results || data);
      } else {
      }
    } catch (error) {
      console.log("Using mock data for recent actions");
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      add: <Plus size={16} className="text-green-500" />,
      delete: <X size={16} className="text-red-500" />,
      edit: <Edit size={16} className="text-yellow-500" />,
      computer: <Desktop size={16} className="text-green-500" />,
    };

    return iconMap[type] || <Plus size={16} />;
  };

  const getRelativeTime = (createdAt: string) => {
    const now = new Date();
    const actionTime = new Date(createdAt);
    const diffInMinutes = Math.floor(
      (now.getTime() - actionTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) {
      return "Только что";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} мин назад`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ч назад`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} д назад`;
    }
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={16} />
          Последние действия
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock size={16} />
        Последние действия
      </div>

      <h3 className="font-medium text-lg">Мои действия</h3>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {actions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Нет последних действий</p>
          </div>
        ) : (
          actions.map((action) => (
            <div
              key={action.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mt-0.5 shrink-0",
                  action.type === "add"
                    ? "bg-green-50 dark:bg-green-900/20"
                    : action.type === "delete"
                    ? "bg-red-50 dark:bg-red-900/20"
                    : action.type === "edit"
                    ? "bg-yellow-50 dark:bg-yellow-900/20"
                    : "bg-green-50 dark:bg-green-900/20"
                )}
              >
                {getActionIcon(action.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm line-clamp-2">
                  {action.user}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {action.category}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {getRelativeTime(action.created_at)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Refresh Button */}
      <div className="pt-4 border-t">
        <button
          onClick={fetchRecentActions}
          disabled={isLoading}
          className="w-full text-sm text-indigo-600 hover:text-indigo-800 py-2 px-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Обновление...
            </div>
          ) : (
            "Обновить"
          )}
        </button>
      </div>
    </div>
  );
}
