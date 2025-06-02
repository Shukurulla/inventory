import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/badge";
import type { TEquipmnetTypesRoom, Tequipment } from "@/types";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";

interface EquipmentStatusModalProps {
  equipmentType: TEquipmnetTypesRoom | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EquipmentStatusModal: React.FC<EquipmentStatusModalProps> = ({
  equipmentType,
  open,
  onOpenChange,
}) => {
  const [equipmentStatuses, setEquipmentStatuses] = useState<
    Record<number, string>
  >({});
  const [isSaving, setIsSaving] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "WORKING":
        return "bg-green-100 text-green-800 border-green-200";
      case "NEEDS_REPAIR":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DISPOSED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "NEW":
        return "Новое";
      case "WORKING":
        return "Нормальный";
      case "NEEDS_REPAIR":
        return "Требуется ремонт";
      case "DISPOSED":
        return "Утилизировано";
      default:
        return status;
    }
  };

  const handleStatusChange = (equipmentId: number, newStatus: string) => {
    setEquipmentStatuses((prev) => ({
      ...prev,
      [equipmentId]: newStatus,
    }));
  };

  const getCurrentStatus = (item: Tequipment) => {
    return equipmentStatuses[item.id] || item.status;
  };

  const hasChanges = () => {
    return Object.keys(equipmentStatuses).length > 0;
  };

  const handleSave = async () => {
    if (!hasChanges()) {
      toast.info("Нет изменений для сохранения");
      return;
    }

    setIsSaving(true);
    try {
      // Here you would call an API to update equipment statuses
      // For now, we'll just simulate a successful update

      // Example API call:
      // await updateEquipmentStatuses(equipmentStatuses);

      toast.success("Статусы успешно обновлены!");
      setEquipmentStatuses({});
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update statuses:", error);
      errorValidatingWithToast(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEquipmentStatuses({});
    onOpenChange(false);
  };

  if (!equipmentType) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-center">
            {equipmentType.name} - Управление состоянием
          </DialogTitle>
        </DialogHeader>

        {/* Header Row */}
        <div className="flex-shrink-0 bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg">
          <div className="grid grid-cols-4 gap-4 font-medium text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              Элемент оборудования
            </div>
            <div className="text-center">ИНН</div>
            <div className="text-center">Статус</div>
            <div className="text-center">Действия</div>
          </div>
        </div>

        {/* Equipment List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {equipmentType.items.map((item) => {
            const currentStatus = getCurrentStatus(item);
            const hasStatusChanged =
              equipmentStatuses[item.id] &&
              equipmentStatuses[item.id] !== item.status;

            return (
              <div
                key={item.id}
                className={`grid grid-cols-4 gap-4 p-3 border rounded-lg transition-colors ${
                  hasStatusChanged
                    ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                {/* Equipment Name */}
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                      {equipmentType.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {item.name}
                  </span>
                </div>

                {/* INN */}
                <div className="flex items-center justify-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    {item.uid || "ИНН-" + String(item.id).padStart(9, "0")}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-center">
                  <Badge className={`${getStatusColor(currentStatus)} border`}>
                    {getStatusText(currentStatus)}
                    {hasStatusChanged && (
                      <span className="ml-1 text-xs">(изменено)</span>
                    )}
                  </Badge>
                </div>

                {/* Status Select */}
                <div className="flex items-center justify-center">
                  <Select
                    value={currentStatus}
                    onValueChange={(value) =>
                      handleStatusChange(item.id, value)
                    }
                  >
                    <SelectTrigger className="w-full max-w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">Новое</SelectItem>
                      <SelectItem value="WORKING">Нормальный</SelectItem>
                      <SelectItem value="NEEDS_REPAIR">
                        Требуется ремонт
                      </SelectItem>
                      <SelectItem value="DISPOSED">Утилизировано</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer with Action Buttons */}
        <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Страница 1 из 4
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="px-6">
              Предыдущий
            </Button>

            <Button
              onClick={handleSave}
              disabled={!hasChanges() || isSaving}
              className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSaving ? "Сохранение..." : "Следующий"}
            </Button>
          </div>
        </div>

        {/* Changes Summary */}
        {hasChanges() && (
          <div className="flex-shrink-0 mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Изменения:</strong>{" "}
              {Object.keys(equipmentStatuses).length} элементов изменено
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EquipmentStatusModal;
