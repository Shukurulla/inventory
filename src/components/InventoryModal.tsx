// src/components/InventoryModal.tsx - TanStack Query Fix
import { useState } from "react";
import InventoryItem from "./InventoryItem";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useGetEquipmentTypesQuery } from "@/api/universityApi";
import StepForm from "./CreateInventoryForm";
import { useQueryClient } from "@tanstack/react-query";

interface InventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: number | null;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  open,
  onOpenChange,
  roomId,
}) => {
  const { data: getEquipmentTypes } = useGetEquipmentTypesQuery();
  const [stepFormVisible, setStepFormVisible] = useState(false);
  const [stepFormData, setStepFormData] = useState({
    name: "",
    id: 0,
    roomId: roomId,
  });

  const queryClient = useQueryClient();

  function handleModal() {
    onOpenChange(!open);
    setStepFormVisible(false);
    // Reset form data when modal closes
    setStepFormData({
      name: "",
      id: 0,
      roomId: roomId,
    });
  }

  // Handle form completion and modal close
  const handleFormComplete = (isOpen: boolean) => {
    if (!isOpen) {
      // Form completed successfully, close entire modal
      setStepFormVisible(false);
      onOpenChange(false);

      // Invalidate and refetch all related queries
      queryClient.invalidateQueries({
        queryKey: ["equipmentsTypesRoom", roomId],
      });
      queryClient.invalidateQueries({
        queryKey: ["blocks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });

      // Force refetch with a small delay
      setTimeout(() => {
        queryClient.refetchQueries({
          queryKey: ["equipmentsTypesRoom", roomId],
        });
      }, 500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleModal}>
      <DialogContent className="w-[70%] xl:w-[50%]" aria-describedby="">
        {!stepFormVisible && (
          <div className="max-h-[60vh] overflow-y-scroll relative dark:bg-zinc-950">
            <DialogHeader className="flex flex-row items-center px-4 fixed h-14 top-0 right-10 left-5 bg-white dark:bg-zinc-950 z-10">
              <DialogTitle className="flex items-center gap-2 text-xl text-accent-foreground font-medium ">
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                </div>
                Элемент инвентаря
              </DialogTitle>
            </DialogHeader>
            <div className="pt-5">
              {getEquipmentTypes?.map((item, index) => (
                <InventoryItem
                  key={index}
                  item={item}
                  roomId={roomId}
                  setStepFormData={(data) => {
                    console.log("Setting step form data:", data);
                    setStepFormData(data);
                  }}
                  onPlusClick={() => {
                    console.log("Plus clicked, showing step form");
                    setStepFormVisible(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
