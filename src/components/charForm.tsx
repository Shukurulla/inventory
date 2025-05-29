import { useState } from "react";
import { EQUIPMENT_TYPES, type createEquipmentBodyType } from "@/types";
import { DesktopForm } from "./DeskTopForm";
import { ProjectorAddForm } from "./AddProjectorForm";
import { PrinterForm } from "./PrinterForm";
import { MonoBlokForm } from "./MonoblokForm";
import { ElectronBoardForm } from "./ElectronicBoardForm";
import { TvForm } from "./TvForm";
import { LaptopForm } from "./LaptopForm";
import { RouterForm } from "./RouterForm";
import { Dialog, DialogContent} from "./ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

type StepFormProps = {
  stepFormData: {
    id: number;
    name: string;
  };
  onOpenChange: (open: boolean) => void;
};

const CharForm = ({ stepFormData, onOpenChange }: StepFormProps) => {
  const [equipmentFormData, setEquipmentFormData] = useState<createEquipmentBodyType>({
    type_id: Number(stepFormData.id),
    room_id: 4,
    description: '',
    status: '',
    contract_id: null,
    count: 1,
    name: '',
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
  })

  const renderForm = () => {
      const equipmentType = EQUIPMENT_TYPES[stepFormData.id];
      switch (equipmentType) {
        case "Компьютер":
          return (
            <DesktopForm  onOpenChange={onOpenChange} create equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
          );
        case "Проектор":
          return (
            <ProjectorAddForm onOpenChange={onOpenChange}  create equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
          );
        case "Принтер":
          return (
            <PrinterForm onOpenChange={onOpenChange}  create equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
          );
        case "Моноблок":
          return (
            <MonoBlokForm onOpenChange={onOpenChange}  create equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
          );
        case "Электронная доска":
          return (
            <ElectronBoardForm onOpenChange={onOpenChange}  create equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
          );
        case "Телевизор":
          return (
            <TvForm onOpenChange={onOpenChange}  create equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
          )
        case "Ноутбук":
          return (
            <LaptopForm onOpenChange={onOpenChange}  create equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
          );
        case "Роутер":
          return (
            <RouterForm onOpenChange={onOpenChange}  create equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
          );
        default:
          return null;
      }
    };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
    <DialogContent className="w-3/4">
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between gap-3 mb-6">
            <div className="w-full text-center relative">
                <span className="text-md font-semibold text-white bg-indigo-600 px-3 p-1 rounded-md relative z-10">
                    <DialogTitle className="bg-indigo-600 inline">
                        <DialogDescription className="inline">{stepFormData.name}</DialogDescription>
                    </DialogTitle>
                </span>
                <div
                className={`h-1 bg-indigo-600 rounded absolute top-1/2 left-0 right-0 z-0`}
                />
            </div>
        </div>

        {renderForm()}
    </DialogContent>
    </Dialog>
  );
};

export default CharForm;