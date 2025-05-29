import type React from "react"
import { Clock, Plus, X, Edit, ComputerIcon as Desktop } from "lucide-react"
import type { RecentAction } from "../types"
import { cn } from "../lib/utils"

interface RecentActionsProps {
  actions: RecentAction[]
}

export function RecentActions({ actions }: RecentActionsProps) {
  const getActionIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      add: <Plus size={16} className="text-green-500" />,
      delete: <X size={16} className="text-red-500" />,
      edit: <Edit size={16} className="text-yellow-500" />,
      computer: <Desktop size={16} className="text-green-500" />,
    }

    return iconMap[type] || <Plus size={16} />
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock size={16} />
        Последние действия
      </div>

      <h3 className="font-medium text-lg">Мои действия</h3>

      <div className="space-y-4">
        {actions.map((action) => (
          <div key={action.id} className="flex items-start gap-3">
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center mt-0.5",
                action.type === "add"
                  ? "bg-green-50"
                  : action.type === "delete"
                    ? "bg-red-50"
                    : action.type === "edit"
                      ? "bg-yellow-50"
                      : "bg-green-50",
              )}
            >
              {getActionIcon(action.type)}
            </div>
            <div className="flex-1">
              <div className="font-medium">{action.title}</div>
              <div className="text-sm text-muted-foreground">{action.category}</div>
            </div>
            <div className="text-sm text-muted-foreground">{action.time}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
