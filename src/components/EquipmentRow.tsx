import EditIcon from "@/assets/Icons/EditIcon";
import GogglesIcon from "@/assets/Icons/GogglesIcon";
import IconLabel from "./ReusableIcon";
import { useState } from "react";
import EditEquipmentDialog from "./EditEquipmentDialog";
import type { Tequipment } from "@/types";
  
  type EquipmentRowProps = {
    equipment: Tequipment;
  };
  
const EquipmentRow = ({ equipment }: EquipmentRowProps) => {
  const [open, setOpen] = useState<boolean>(false)
  
return(
  <div className="border-t ml-3 h-20 bg-white flex items-center px-4">
    <div className="flex items-center justify-between w-full h-full">
      <IconLabel color="#D9B88C" label={equipment.name} classIcon="" icon={GogglesIcon} className=""/>
      <div className="bg-amber-400/15 w-12 h-12 rounded-full flex items-center justify-center">
        <EditIcon width={28} onClick={()=> setOpen(true)}/>
      </div>
    </div>
    <EditEquipmentDialog equipment={equipment} showEditModal={open} setShowEditModal={setOpen} />
  </div>
)};
  
export default EquipmentRow;
