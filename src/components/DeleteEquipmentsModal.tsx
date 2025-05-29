import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState } from "react";
import type { TEquipmnetTypesRoom} from "@/types";
import { useDeleteEquipmentsMutation } from "@/api/universityApi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Loader2 } from "lucide-react";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";
import { toast } from "react-toastify";

interface DeleteModalPropsTypes {
  equipmentType: TEquipmnetTypesRoom;
  setShowDeleteModal: (value: boolean) => void;
  showDeleteModal: boolean;
}

const DeleteInventoryModal = ({
  equipmentType,
  setShowDeleteModal,
  showDeleteModal,
}: DeleteModalPropsTypes) => {
  const [deleteEquipments, { isLoading }] = useDeleteEquipmentsMutation();
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState<number[]>(
    []
  );
  const { selectedRoomId } = useSelector(
    (state: RootState) => state.university
  );

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setSelectedEquipmentIds((prev) =>
      checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)
    );
  };

  const handleSubmit = async () => {
    if (!selectedRoomId ||selectedEquipmentIds.length === 0) {
      toast.warning("Please select at least one equipment and a room.");
      return;
    }

    try {
      await deleteEquipments({
        ids: selectedEquipmentIds,
      }).unwrap();
      toast.success("Оборудование успешно удалено!");
			setSelectedEquipmentIds([]);
      setShowDeleteModal(false);
			window.location.reload()
    } catch (error) {
      console.error("Failed to move equipment:", error);
      errorValidatingWithToast(error);
    }
  };

  return (
    <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dard:bg-card p-6 rounded-lg shadow-lg w-[50%] max-h-[80vh] flex flex-col">
        <DialogTitle className="text-lg font-bold w-full">
          Перемещение оборудование
        </DialogTitle>
        <div className="max-h-96 overflow-y-scroll border py-3 rounded-lg">
          {equipmentType?.items.map((item) => (
            <div
              key={item.id}
              className="flex h-14 px-3 first:border-t border-b last:border-b-0 items-center space-x-5"
            >
              <Checkbox id={`item-${item.name}`} checked={selectedEquipmentIds.includes(item.id)}
									onCheckedChange={(checked: boolean) =>
										handleCheckboxChange(item.id, checked as boolean)
									}
									onClick={(event: React.MouseEvent) => event.stopPropagation()}
									className="w-5 h-5 border-2 border-indigo-500 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-600"
              />
              <label
									htmlFor={`item-${item.id}`}
									className="text-xl flex-1 text-indigo-600"
              >
                	{item.name}
              </label>
              <span className="flex-1 text-center text-lg ">
                {item.status === "NEW"
                  ? "Новое"
                  : item.status === "WORKING"
                  ? "Рабочее"
                  : item.status === "NEEDS_REPAIR"
                  ? "Требуется ремонт"
                  : item.status === "DISPOSED"
                  ? "Утилизировано"
                  : ""}
              </span>
              <div className="flex-1 bg-red-300"></div>
            </div>
          ))}
        </div>
        <div className="flex items-center w-full mt-4 gap-x-2">
          <Button
            variant="outline"
            className="flex-1 h-12 bg-indigo-600 text-accent-foreground hover:text-accent-foreground text-xl hover:bg-indigo-700"
            onClick={() => setShowDeleteModal(false)}
          >
            Отменить
          </Button>
          <Button
            className="flex-1 h-12 bg-indigo-600 text-accent-foreground hover:text-accent-foreground text-xl hover:bg-indigo-700"
            onClick={handleSubmit}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Удалить"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInventoryModal;
