import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
//   import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
//   } from "@/components/ui/select";
import type { Tequipment } from "@/types";
// import { useState } from "react";

interface MoveModalPropsTypes {
  equipment: Tequipment;
  setShowEditModal: (value: boolean) => void;
  showEditModal: boolean;
}

const EditEquipmentDialog = ({
  equipment,
  setShowEditModal,
  showEditModal,
}: MoveModalPropsTypes) => {
  // const [formData, setFormData] = useState({
  //     status: equipment.status,
  //     is_active: equipment.is_active,

  // })
  console.log(equipment.id);

  return (
    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[50%] max-h-[80vh] flex flex-col">
        <DialogTitle className="text-lg font-bold mb-4 w-full">
          Edit Equipment
        </DialogTitle>
        {/* <div>
                    <Select
                        value={data.status}
                        onValueChange={(value) => setData({ ...data, status: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Состояние техники" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="NEW">Новое</SelectItem>
                            <SelectItem value="WORKING">Рабочее</SelectItem>
                            <SelectItem value="NEEDS_REPAIR">Требуется ремонт</SelectItem>
                            <SelectItem value="DISPOSED">Утилизировано</SelectItem>
                        </SelectContent>
                    </Select>
                </div> */}

        {/* <div className="h-96 overflow-y-scroll text-black">
                    {equipmentType?.items.map((item) => (
                        <div key={item.id} className="flex h-12 border-b last:border-b-0 items-center space-x-5 mb-2">
                            <Checkbox
                                id={`item-${item.id}`}
                                defaultChecked
                                className="w-5 h-5 border-2 border-indigo-500 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-600"
                            />
                            <label htmlFor={`item-${item.id}`} className="text-xl text-indigo-600">
                                {item.name}
                            </label>
                        </div>
                    ))}
                </div> */}
        {/* <div>
                    <p className="font-medium mb-2">Select Room</p>
                    <Select>
                    <SelectTrigger className="w-full !h-12 text-lg border rounded p-2">
                        <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                        {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id.toString()}>
                            {room.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
               </div> */}
        <div className="flex items-center w-full gap-x-2">
          <Button
            variant="outline"
            className="flex-1 h-12 bg-indigo-600 text-white hover:text-white text-xl hover:bg-indigo-700"
            onClick={() => setShowEditModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-12 bg-indigo-600 text-white hover:text-white text-xl hover:bg-indigo-700"
            onClick={() => {
              // Handle save logic here
              setShowEditModal(false);
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEquipmentDialog;
