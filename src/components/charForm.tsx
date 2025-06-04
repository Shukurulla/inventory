import { useState } from "react";
import { type createEquipmentBodyType } from "@/types";
import { DesktopForm } from "./DeskTopForm";
import { ProjectorAddForm } from "./AddProjectorForm";
import { PrinterForm } from "./PrinterForm";
import { MonoBlokForm } from "./MonoblokForm";
import { ElectronBoardForm } from "./ElectronicBoardForm";
import { TvForm } from "./TvForm";
import { LaptopForm } from "./LaptopForm";
import { RouterForm } from "./RouterForm";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type StepFormProps = {
  stepFormData: {
    id: number;
    name: string;
  };
  onOpenChange: (open: boolean) => void;
};

const CharForm = ({ stepFormData, onOpenChange }: StepFormProps) => {
  const [equipmentFormData, setEquipmentFormData] =
    useState<createEquipmentBodyType>({
      type_id: Number(stepFormData.id),
      room_id: 4,
      description: "",
      status: "",
      contract_id: null,
      count: 1,
      name: "",
      name_prefix: stepFormData.name,
      is_active: false,
      photo: undefined,
      computer_details: null,
      printer_char: null,
      extender_char: null,
      router_char: null,
      tv_char: null,
      notebook_char: null,
      monoblok_char: null,
      projector_char: null,
      whiteboard_char: null,
      computer_specification_id: null,
      printer_specification_id: null,
      extender_specification_id: null,
      router_specification_id: null,
      tv_specification_id: null,
      notebook_specification_id: null,
      monoblok_specification_id: null,
      projector_specification_id: null,
      whiteboard_specification_id: null,
    });

  // Default form for unknown equipment types
  const renderDefaultForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="model">Модель</Label>
            <Input id="model" placeholder="Введите модель" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="brand">Бренд</Label>
            <Input id="brand" placeholder="Введите бренд" className="mt-1" />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Описание</Label>
          <Input
            id="description"
            placeholder="Введите описание характеристик"
            className="mt-1"
          />
        </div>

        <div className="flex justify-between mt-6 gap-x-2">
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 text-accent-foreground bg-indigo-600 hover:bg-indigo-500"
            onClick={() => onOpenChange(false)}
          >
            Назад
          </Button>
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 text-accent-foreground bg-indigo-600 hover:bg-indigo-500"
            onClick={() => {
              console.log("Создание шаблона для:", stepFormData.name);
              onOpenChange(false);
            }}
          >
            Создать шаблон
          </Button>
        </div>
      </div>
    );
  };

  // Extended form for Monitor (since it was disabled in other components)
  const renderMonitorForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="monitor-model">Модель</Label>
            <Input
              id="monitor-model"
              placeholder="Samsung LS24F350FH"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="monitor-size">Размер экрана (дюймы)</Label>
            <Input
              id="monitor-size"
              type="number"
              placeholder="24"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="monitor-resolution">Разрешение</Label>
            <Select>
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
            <Select>
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
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="monitor-ports">Порты подключения</Label>
            <div className="mt-1 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="hdmi" />
                <Label htmlFor="hdmi">HDMI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="vga" />
                <Label htmlFor="vga">VGA</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="dvi" />
                <Label htmlFor="dvi">DVI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="displayport" />
                <Label htmlFor="displayport">DisplayPort</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6 gap-x-2">
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 text-accent-foreground bg-indigo-600 hover:bg-indigo-500"
            onClick={() => onOpenChange(false)}
          >
            Назад
          </Button>
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 text-accent-foreground bg-indigo-600 hover:bg-indigo-500"
            onClick={() => {
              console.log("Создание шаблона монитора");
              onOpenChange(false);
            }}
          >
            Создать шаблон
          </Button>
        </div>
      </div>
    );
  };

  // Extended form for Extension cord/Power strip
  const renderExtensionForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ext-model">Модель</Label>
            <Input
              id="ext-model"
              placeholder="Введите модель"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ext-ports">Количество розеток</Label>
            <Input
              id="ext-ports"
              type="number"
              placeholder="6"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ext-length">Длина кабеля (м)</Label>
            <Input
              id="ext-length"
              type="number"
              step="0.1"
              placeholder="3.0"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="ext-power">Максимальная мощность (Вт)</Label>
            <Input
              id="ext-power"
              type="number"
              placeholder="3500"
              className="mt-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Дополнительные функции</Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="surge-protection" />
              <Label htmlFor="surge-protection">Защита от перенапряжения</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="usb-ports" />
              <Label htmlFor="usb-ports">USB порты</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="switch" />
              <Label htmlFor="switch">Выключатель</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="led-indicator" />
              <Label htmlFor="led-indicator">LED индикатор</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6 gap-x-2">
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 text-accent-foreground bg-indigo-600 hover:bg-indigo-500"
            onClick={() => onOpenChange(false)}
          >
            Назад
          </Button>
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 text-accent-foreground bg-indigo-600 hover:bg-indigo-500"
            onClick={() => {
              console.log("Создание шаблона удлинителя");
              onOpenChange(false);
            }}
          >
            Создать шаблон
          </Button>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    const equipmentType = stepFormData.name; // Bu muhim o'zgarish
    console.log("Rendering form for:", equipmentType, "ID:", stepFormData.id);
    console.log("Props being passed:", { create: true, onOpenChange });

    switch (equipmentType) {
      case "Компьютер":
        return (
          <DesktopForm
            onOpenChange={onOpenChange}
            create={true}
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Проектор":
        return (
          <ProjectorAddForm
            onOpenChange={onOpenChange}
            create={true}
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Принтер":
        return (
          <PrinterForm
            onOpenChange={onOpenChange}
            create={true}
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Моноблок":
        return (
          <MonoBlokForm
            onOpenChange={onOpenChange}
            create={true}
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Электронная доска":
        console.log("ElectronicBoard: Rendering with props", {
          create: true,
          onOpenChange,
        });
        return (
          <ElectronBoardForm
            onOpenChange={onOpenChange}
            create={true}
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Телевизор":
        console.log("TV: Rendering with props", { create: true, onOpenChange });
        return (
          <TvForm
            onOpenChange={onOpenChange}
            create={true}
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Ноутбук":
        console.log("Laptop: Rendering with props", {
          create: true,
          onOpenChange,
        });
        return (
          <LaptopForm
            onOpenChange={onOpenChange}
            create={true}
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Роутер":
        console.log("Router: Rendering with props", {
          create: true,
          onOpenChange,
        });
        return (
          <RouterForm
            onOpenChange={onOpenChange}
            create={true}
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Монитор":
        return renderMonitorForm();
      case "Удлинитель":
        return renderExtensionForm();
      default:
        return renderDefaultForm();
    }
  };
  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="w-3/4 max-h-[90vh] overflow-y-auto">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="w-full text-center relative">
            <span className="text-md font-semibold text-white bg-indigo-600 px-3 p-1 rounded-md relative z-10">
              <DialogTitle className="bg-indigo-600 inline">
                <DialogDescription className="inline">
                  Создать шаблон: {stepFormData.name}
                </DialogDescription>
              </DialogTitle>
            </span>
            <div className="h-1 bg-indigo-600 rounded absolute top-1/2 left-0 right-0 z-0" />
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-4">{renderForm()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default CharForm;
