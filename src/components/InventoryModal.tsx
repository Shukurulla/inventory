import { useState } from "react";
import InventoryItem from "./InventoryItem";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useGetEquipmentTypesQuery } from "@/api/universityApi";
import StepForm from "./CreateInventoryForm";
interface InventoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomId: number | null;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  open,
  onOpenChange,
  roomId
}) => {
  const { data: getEquipmentTypes } = useGetEquipmentTypesQuery();
  const [stepFormVisible, setStepFormVisible] = useState(false);
  const [stepFormData, setStepFormData] = useState({
    name: "",
    id: 0,
    roomId: roomId
  });

  function handleModal(){
    onOpenChange(!open);
    setStepFormVisible(false);
  }
  
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
                  setStepFormData={setStepFormData}
                  onPlusClick={() => setStepFormVisible(true)}
                />
              ))}
            </div>
          </div>
        )}
        {stepFormVisible && (
          <div>
            <StepForm stepFormData={stepFormData} onOpenChange={onOpenChange}/>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
