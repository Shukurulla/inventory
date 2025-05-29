import { CircleIcon, Plus } from "lucide-react";
import { Button } from "./ui/button";
import type { EquipmentTypes } from "@/types";
import MonoblockIcon from "@/assets/Icons/MonoblockIcon";
import ElectronBoardIcon from "@/assets/Icons/EelctronBoardIcon";
import TvIcon from "@/assets/Icons/TvIcon";
import MonitorIcon from "@/assets/Icons/MonitorIocn";
import LaptopIcon from "@/assets/Icons/LaptopIcon";
import RouterIcon from "@/assets/Icons/RouterIcon";
import PrinterIcon from "@/assets/Icons/PrinterIcon";
import DesktopIcon from "@/assets/Icons/DesktopIcon";
import type { JSX } from "react";
import GogglesIcon from "@/assets/Icons/GogglesIcon";

interface InventoryItemProps {
  item: EquipmentTypes;
  onPlusClick?: () => void;
  setStepFormData?: (data: { name: string; id: number; roomId: number }) => void;
  roomId: number | null;
}
interface EquipmentIcons {
  icon: JSX.Element;
  name: string;
  color: string;
}

const InventoryItem: React.FC<InventoryItemProps> = ({
  item,
  onPlusClick,
  setStepFormData,
  roomId,
}) => {
  const inventoryIcons: EquipmentIcons[] = [
    {
      icon: (
        <DesktopIcon color="#5CB8D1" className="bg-[#DAF1FB] dark:bg-blue-300/30 rounded-full dark:brightness-70" />
      ),
      name: "Компьютер",
      color: "#5CB8D1",
    },
    {
      icon: <MonoblockIcon className="dark:brightness-70"/>,
      name: "Моноблок",
      color: "bg-green-50 dark:bg-green-300/10",
    },
    {
      icon: <ElectronBoardIcon className="dark:brightness-70"/>,
      name: "Электронная доска",
      color: "bg-purple-50 dark:bg-green-400/10",
    },
    {
      icon: <TvIcon className="h-6 w-6 dark:brightness-70" />,
      name: "Телевизор",
      color: "bg-orange-50 dark:bg-green-400/10",
    },
    {
      icon: <MonitorIcon className="h-6 w-6 dark:brightness-70" />,
      name: "Монитор",
      color: "bg-green-50 dark:bg-green-400/10",
    },
    {
      icon: <LaptopIcon className="dark:brightness-70"/>,
      name: "Ноутбук",
      color: "bg-blue-50 dark:bg-green-400/10",
    },
    {
      icon: <PrinterIcon className="h-6 w-6 dark:brightness-70" />,
      name: "Принтер",
      color: "bg-pink-50 dark:bg-green-400/10",
    },
    {
      icon: <RouterIcon className="h-6 w-6 dark:brightness-70" />,
      name: "Роутер",
      color: "bg-orange-50 dark:bg-green-400/10",
    },
    {
      icon: <GogglesIcon className="h-6 w-6 dark:brightness-70" />,
      name: "Проектор",
      color: "bg-green-100 dark:bg-green-400/10",
    },
  ];

  const matchedIcon = inventoryIcons.find((icon) => icon.name === item.name);

  const handleClick = () => {
    if (setStepFormData && onPlusClick) {
      setStepFormData({
        name: item.name,
        id: item.id,
        roomId: roomId || 0,
      });
      onPlusClick();
    }
  };

  return (
    <div className={`flex items-center justify-between py-4 px-4 border-b border-zinc-200 dark:border-accent`}>
      <div className={`flex items-center gap-4`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            matchedIcon?.color || "bg-blue-50"
          }`}
        >
          <div className="text-gray-600">
            {matchedIcon?.icon || <CircleIcon />}
          </div>
        </div>
        <span className="text-lg font-medium text-accent-foreground pointer-events-none" onClick={(e)=> e.stopPropagation()}>{item.name}</span>
      </div>
      <div className="flex-1 flex justify-end" onClick={handleClick}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full bg-accent hover:bg-blue-100"
        >
          <Plus className="h-5 w-5 text-blue-500" />
        </Button>
      </div>
    </div>
  );
};

export default InventoryItem;
