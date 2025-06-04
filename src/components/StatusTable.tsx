// src/components/StatusTable.tsx - Updated with delete-create edit system
import { useState } from "react";
import {
  useGetAddedEquipmentsQuery,
  useBulkCreateEquipmentMutation,
  useDeleteEquipmentsMutation,
} from "@/api/universityApi";
import { EQUIPMENT_TYPES } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/badge";
import type { Tequipment } from "@/types";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";

export function StatusTable() {
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipments, setSelectedEquipments] = useState<Tequipment[]>(
    []
  );
  const [selectedType, setSelectedType] = useState<string>("");
  const [equipmentStatuses, setEquipmentStatuses] = useState<
    Record<number, string>
  >({});
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    data: allEquipments = [],
    isLoading,
    error,
    refetch,
  } = useGetAddedEquipmentsQuery();
  const [bulkCreate] = useBulkCreateEquipmentMutation();
  const [deleteEquipments] = useDeleteEquipmentsMutation();

  // Group equipment by type
  const groupedEquipments = Object.entries(EQUIPMENT_TYPES)
    .map(([typeId, typeName]) => {
      const items = allEquipments.filter(
        (item) => item.type === parseInt(typeId)
      );
      const statusCounts = items.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        id: parseInt(typeId),
        name: typeName,
        items,
        statusCounts,
        totalCount: items.length,
      };
    })
    .filter((group) => group.totalCount > 0);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800";
      case "WORKING":
        return "bg-green-100 text-green-800";
      case "NEEDS_REPAIR":
        return "bg-yellow-100 text-yellow-800";
      case "DISPOSED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTypeClick = (equipments: Tequipment[], typeName: string) => {
    setSelectedEquipments(equipments);
    setSelectedType(typeName);
    setShowModal(true);
    setEquipmentStatuses({});
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

  // New delete-create edit system
  const handleSave = async () => {
    if (Object.keys(equipmentStatuses).length === 0) {
      toast.info("Нет изменений для сохранения");
      return;
    }

    setIsUpdating(true);

    try {
      const changedEquipments = selectedEquipments.filter(
        (equipment) =>
          equipmentStatuses[equipment.id] &&
          equipmentStatuses[equipment.id] !== equipment.status
      );

      let successCount = 0;
      let errorCount = 0;

      for (const equipment of changedEquipments) {
        try {
          const newStatus = equipmentStatuses[equipment.id];

          // Step 1: Create new equipment with updated status
          const createPayload = {
            type_id: equipment.type,
            room_id: equipment.room,
            description: equipment.description,
            status: newStatus,
            contract_id: equipment.contract,
            count: 1,
            name_prefix: equipment.name,
            is_active: equipment.is_active,
            computer_details: equipment.computer_details
              ? JSON.parse(equipment.computer_details)
              : null,
            printer_char: equipment.printer_char
              ? JSON.parse(equipment.printer_char)
              : null,
            projector_char: equipment.projector_char
              ? JSON.parse(equipment.projector_char)
              : null,
            monoblok_char: equipment.monoblok_char
              ? JSON.parse(equipment.monoblok_char)
              : null,
            whiteboard_char: equipment.whiteboard_char
              ? JSON.parse(equipment.whiteboard_char)
              : null,
            tv_char: equipment.tv_char ? JSON.parse(equipment.tv_char) : null,
            notebook_char: equipment.notebook_char
              ? JSON.parse(equipment.notebook_char)
              : null,
            router_char: equipment.router_char
              ? JSON.parse(equipment.router_char)
              : null,
            extender_char: equipment.extender_char
              ? JSON.parse(equipment.extender_char)
              : null,
          };

          await bulkCreate(createPayload).unwrap();

          // Step 2: Delete old equipment
          await deleteEquipments({ ids: [equipment.id] }).unwrap();

          successCount++;
        } catch (error) {
          console.error(`Failed to update equipment ${equipment.id}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Успешно обновлено: ${successCount} элементов`);
        if (errorCount > 0) {
          toast.warning(`Ошибки при обновлении: ${errorCount} элементов`);
        }
        setEquipmentStatuses({});
        setShowModal(false);
        refetch();
      } else {
        toast.error("Не удалось обновить ни одного элемента");
      }
    } catch (error) {
      console.error("Failed to update statuses:", error);
      errorValidatingWithToast(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getEquipmentINN = (item: Tequipment) => {
    if (item.inn && item.inn !== 0) {
      return item.inn.toString();
    }
    if (item.uid) {
      const numericINN = parseInt(item.uid);
      if (!isNaN(numericINN) && numericINN > 0) {
        return item.uid;
      }
      if (item.uid.includes("-")) {
        return `ИНН-${item.id.toString().padStart(9, "0")}`;
      }
      return item.uid;
    }
    return `ИНН-${item.id.toString().padStart(9, "0")}`;
  };

  const hasChanges = () => {
    return Object.keys(equipmentStatuses).length > 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Загрузка оборудования...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-red-500">Ошибка загрузки данных</div>
        <Button
          onClick={refetch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (allEquipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-gray-500">
          Нет оборудования для отображения
        </div>
        <div className="text-sm text-gray-400">
          Сначала добавьте оборудование через раздел "Университет"
        </div>
        <Button onClick={refetch} variant="outline">
          Обновить
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Equipment Types List */}
      <div className="grid gap-4">
        {groupedEquipments.map((group) => (
          <div
            key={group.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => handleTypeClick(group.items, group.name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 font-medium">
                    {group.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {group.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Всего: {group.totalCount} единиц
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {Object.entries(group.statusCounts).map(([status, count]) => (
                  <span
                    key={status}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      status
                    )}`}
                  >
                    {getStatusText(status)}: {count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedType} - Управление состоянием
            </DialogTitle>
          </DialogHeader>

          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="grid grid-cols-4 gap-4 font-medium text-sm text-gray-600 dark:text-gray-300">
              <div>Оборудование</div>
              <div className="text-center">ИНН</div>
              <div className="text-center">Текущий статус</div>
              <div className="text-center">Новый статус</div>
            </div>
          </div>

          {/* Equipment List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {selectedEquipments.map((item) => {
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
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                        {selectedType.charAt(0)}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {item.name}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      {getEquipmentINN(item)}
                    </span>
                  </div>

                  <div className="text-center">
                    <Badge className={`${getStatusColor(item.status)} border`}>
                      {getStatusText(item.status)}
                      {hasStatusChanged && (
                        <span className="ml-1 text-xs">(изменено)</span>
                      )}
                    </Badge>
                  </div>

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

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {Object.keys(equipmentStatuses).length > 0 && (
                <span className="text-blue-600">
                  Изменено: {Object.keys(equipmentStatuses).length} элементов
                </span>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEquipmentStatuses({});
                  setShowModal(false);
                }}
                disabled={isUpdating}
              >
                Отменить
              </Button>

              <Button
                onClick={handleSave}
                disabled={!hasChanges() || isUpdating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isUpdating ? "Сохранение..." : "Сохранить изменения"}
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
    </div>
  );
}
