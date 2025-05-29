import type React from "react"
import { ComputerIcon as Desktop, Monitor, Laptop, Printer, Router, Tv, LightbulbIcon, PlusIcon } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import type { InventoryItem } from "@/types"

interface InventoryTableProps {
  items: InventoryItem[]
}

export function InventoryTable({ items }: InventoryTableProps) {
  const getIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      computer: <Desktop size={20} />,
      monoblock: <Desktop size={20} />,
      "electronic-board": <Monitor size={20} />,
      tv: <Tv size={20} />,
      monitor: <Monitor size={20} />,
      laptop: <Laptop size={20} />,
      printer: <Printer size={20} />,
      router: <Router size={20} />,
      extension: <LightbulbIcon size={20} />,
    }

    return iconMap[type] || <Desktop size={20} />
  }

  const getIconBgColor = (type: string) => {
    const colorMap: Record<string, string> = {
      computer: "bg-indigo-100 text-indigo-500",
      monoblock: "bg-green-100 text-green-600",
      "electronic-board": "bg-purple-100 text-purple-600",
      tv: "bg-orange-100 text-orange-500",
      monitor: "bg-green-100 text-green-500",
      laptop: "bg-blue-100 text-blue-500",
      printer: "bg-pink-100 text-pink-500",
      router: "bg-orange-100 text-orange-500",
      extension: "bg-yellow-100 text-yellow-600",
    }

    return colorMap[type] || "bg-gray-50"
  }

  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-3 p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
            </svg>
          </div>
          Элемент инвентаря
        </div>
        <div className="text-sm font-medium text-center lg:text-start text-muted-foreground">Наличие</div>
        <div></div>
      </div>
      <div>
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-3 p-4 border-b last:border-0">
            <div className="flex items-center gap-3 bg-red-400">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", getIconBgColor(item.type))}>
                {getIcon(item.type)}
              </div>
              <span>{item.name}</span>
            </div>
            <div className="flex items-center justify-center lg:justify-start bg-green-400">
              {item.quantity > 0 && <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-xs">{item.quantity}</div>}
            </div>
            <div className="flex justify-end">
              <Button variant="ghost" className="rounded-full">
                Add
                <PlusIcon/>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
