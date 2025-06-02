import { useState } from "react";
import { useGetAddedEquipmentsQuery } from "@/api/universityApi";
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

  console.log("StatusTable - API Response:", {
    allEquipments,
    isLoading,
    error,
  });

  // Group equipment by type
  const groupedEquipments = Object.entries(EQUIPMENT_TYPES)
    .map(([typeId, typeName]) => {
      const items = allEquipments.filter(
        (item) => item.type === parseInt(typeId)
      );

      // Count by status
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
    setEquipmentStatuses({}); // Reset statuses when opening modal
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

  // Manual API call for updating equipment status
  const updateEquipmentStatus = async (equipmentId: number, status: string) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(
      `https://invenmaster.pythonanywhere.com/inventory/equipment/${equipmentId}/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
    }

    return response.json();
  };

  const handleSave = async () => {
    if (Object.keys(equipmentStatuses).length === 0) {
      toast.info("Нет изменений для сохранения");
      return;
    }

    setIsUpdating(true);

    try {
      // Update each equipment individually
      const updates = Object.entries(equipmentStatuses);
      let successCount = 0;
      let errorCount = 0;

      for (const [equipmentId, status] of updates) {
        try {
          await updateEquipmentStatus(parseInt(equipmentId), status);
          successCount++;
        } catch (error) {
          console.error(`Failed to update equipment ${equipmentId}:`, error);
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
        refetch(); // Refresh data
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

  // Alternative save method - simulate API call for testing
  const handleSaveSimulated = async () => {
    if (Object.keys(equipmentStatuses).length === 0) {
      toast.info("Нет изменений для сохранения");
      return;
    }

    setIsUpdating(true);

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Simulated status updates:", equipmentStatuses);

      toast.success("Статусы успешно обновлены! (Симуляция)");
      setEquipmentStatuses({});
      setShowModal(false);
      // Don't refetch for simulation
    } catch (error) {
      console.error("Simulation failed:", error);
      toast.error("Ошибка при симуляции");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRetry = () => {
    refetch();
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
        <div className="text-sm text-gray-500 max-w-md text-center">
          {JSON.stringify(error).substring(0, 200)}...
        </div>
        <Button
          onClick={handleRetry}
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
        <Button onClick={handleRetry} variant="outline">
          Обновить
        </Button>
      </div>
    );
  }

  if (groupedEquipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-gray-500">
          Оборудование найдено, но не удалось сгруппировать
        </div>
        <div className="text-sm text-gray-400">
          Всего оборудования: {allEquipments.length}
        </div>
        <Button onClick={handleRetry} variant="outline">
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
              const hasChanged =
                equipmentStatuses[item.id] &&
                equipmentStatuses[item.id] !== item.status;

              return (
                <div
                  key={item.id}
                  className={`grid grid-cols-4 gap-4 p-3 border rounded-lg transition-colors ${
                    hasChanged
                      ? "border-blue-300 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="font-medium">{item.name}</span>
                  </div>

                  <div className="text-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.uid || `ИНН-${item.id.toString().padStart(9, "0")}`}
                    </span>
                  </div>

                  <div className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <Select
                      value={currentStatus}
                      onValueChange={(value) =>
                        handleStatusChange(item.id, value)
                      }
                    >
                      <SelectTrigger className="w-40">
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

              {/* Real API Save */}
              <Button
                onClick={handleSave}
                disabled={
                  Object.keys(equipmentStatuses).length === 0 || isUpdating
                }
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isUpdating ? "Сохранение..." : "Сохранить изменения"}
              </Button>

              {/* Simulated Save for Testing */}
              <Button
                onClick={handleSaveSimulated}
                disabled={
                  Object.keys(equipmentStatuses).length === 0 || isUpdating
                }
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                {isUpdating ? "Симуляция..." : "Тест (Симуляция)"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
