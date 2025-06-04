"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import type { createFormPropsType, MonitorSpecs } from "@/types"

export const MonitorForm = ({
  equipmentFormData,
  setEquipmentFormData,
  create = false,
  onOpenChange,
}: createFormPropsType) => {
  const [monitorSpecs, setMonitorSpecs] = useState<MonitorSpecs>({
    model: "",
    screen_size: 24,
    resolution: "",
    panel_type: "ips",
    refresh_rate: 60,
    ports: {
      hdmi: false,
      vga: false,
      dvi: false,
      displayport: false,
    },
  })

  const handleSubmit = () => {
    setEquipmentFormData({
      ...equipmentFormData,
      monitor_char: monitorSpecs,
    })

    if (create && onOpenChange) {
      console.log("Creating monitor template with specs:", monitorSpecs)
      onOpenChange(false)
    }
  }

  const handleBack = () => {
    if (onOpenChange) {
      onOpenChange(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="monitor-model">Модель</Label>
          <Input
            id="monitor-model"
            placeholder="Samsung LS24F350FH"
            value={monitorSpecs.model}
            onChange={(e) => setMonitorSpecs({ ...monitorSpecs, model: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="monitor-size">Размер экрана (дюймы)</Label>
          <Input
            id="monitor-size"
            type="number"
            placeholder="24"
            value={monitorSpecs.screen_size}
            onChange={(e) =>
              setMonitorSpecs({
                ...monitorSpecs,
                screen_size: Number.parseInt(e.target.value) || 24,
              })
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="monitor-resolution">Разрешение</Label>
          <Select
            value={monitorSpecs.resolution}
            onValueChange={(value) => setMonitorSpecs({ ...monitorSpecs, resolution: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Выберите разрешение" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
              <SelectItem value="2560x1440">2560x1440 (2K)</SelectItem>
              <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
              <SelectItem value="1366x768">1366x768 (HD)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="monitor-panel">Тип панели</Label>
          <Select
            value={monitorSpecs.panel_type}
            onValueChange={(value: "ips" | "va" | "tn" | "oled") =>
              setMonitorSpecs({ ...monitorSpecs, panel_type: value })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Выберите тип панели" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ips">IPS</SelectItem>
              <SelectItem value="va">VA</SelectItem>
              <SelectItem value="tn">TN</SelectItem>
              <SelectItem value="oled">OLED</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="monitor-refresh">Частота обновления (Hz)</Label>
          <Input
            id="monitor-refresh"
            type="number"
            placeholder="60"
            value={monitorSpecs.refresh_rate}
            onChange={(e) =>
              setMonitorSpecs({
                ...monitorSpecs,
                refresh_rate: Number.parseInt(e.target.value) || 60,
              })
            }
            className="mt-1"
          />
        </div>
        <div>
          <Label>Порты подключения</Label>
          <div className="mt-1 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hdmi"
                checked={monitorSpecs.ports.hdmi}
                onCheckedChange={(checked) =>
                  setMonitorSpecs({
                    ...monitorSpecs,
                    ports: { ...monitorSpecs.ports, hdmi: checked as boolean },
                  })
                }
              />
              <Label htmlFor="hdmi">HDMI</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vga"
                checked={monitorSpecs.ports.vga}
                onCheckedChange={(checked) =>
                  setMonitorSpecs({
                    ...monitorSpecs,
                    ports: { ...monitorSpecs.ports, vga: checked as boolean },
                  })
                }
              />
              <Label htmlFor="vga">VGA</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dvi"
                checked={monitorSpecs.ports.dvi}
                onCheckedChange={(checked) =>
                  setMonitorSpecs({
                    ...monitorSpecs,
                    ports: { ...monitorSpecs.ports, dvi: checked as boolean },
                  })
                }
              />
              <Label htmlFor="dvi">DVI</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="displayport"
                checked={monitorSpecs.ports.displayport}
                onCheckedChange={(checked) =>
                  setMonitorSpecs({
                    ...monitorSpecs,
                    ports: { ...monitorSpecs.ports, displayport: checked as boolean },
                  })
                }
              />
              <Label htmlFor="displayport">DisplayPort</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6 gap-x-2">
        <Button
          variant="default"
          className="gap-1 h-12 text-md flex-1 text-accent-foreground bg-indigo-600 hover:bg-indigo-500"
          onClick={handleBack}
        >
          Назад
        </Button>
        <Button
          variant="default"
          className="gap-1 h-12 text-md flex-1 text-accent-foreground bg-indigo-600 hover:bg-indigo-500"
          onClick={handleSubmit}
        >
          {create ? "Создать шаблон" : "Сохранить"}
        </Button>
      </div>
    </div>
  )
}
