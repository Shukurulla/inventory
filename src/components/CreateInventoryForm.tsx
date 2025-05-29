import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBulkCreateEquipmentMutation, useBulkUpdateInnMutation } from "@/api/universityApi";
import { EQUIPMENT_TYPES, type SetInnType, type createEquipmentBodyType } from "@/types";
import { toast } from "react-toastify";
import { StepOneForm } from "./FirstStepForm";
import AddInnForm from "./AddInnForm";
import { DesktopForm } from "./DeskTopForm";
import { ProjectorAddForm } from './AddProjectorForm';
import { PrinterForm } from "./PrinterForm";
import { MonoBlokForm } from "./MonoblokForm";
import { ElectronBoardForm } from "./ElectronicBoardForm";
import { TvForm } from "./TvForm";
import { LaptopForm } from "./LaptopForm";
import { RouterForm } from "./RouterForm";

type StepFormProps = {
  stepFormData: {
    id: number;
    name: string;
    roomId: number | null;
  };
  onOpenChange: (open: boolean) => void;
};

const StepForm = ({ stepFormData, onOpenChange }: StepFormProps) => {
  const [step, setStep] = useState(1);
  const [equipmentFormData, setEquipmentFormData] = useState<createEquipmentBodyType>({
    type_id: Number(stepFormData.id),
    room_id: Number(stepFormData.roomId),
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
  const [formDataThird, setFormDataThird] = useState<SetInnType[]>([]);
  const [bulkCreate, { isLoading }] = useBulkCreateEquipmentMutation();
  const [bulkUpdateInn] = useBulkUpdateInnMutation();

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleSubmit = async () => {
    if (step === 1 || step === 2) {
      handleNext();
    }
    if (step === 2) {
      try {
        const formData = new FormData();
        Object.entries(equipmentFormData).forEach(([key, value]) => {
          if (value && value !== undefined) {
            formData.append(key, value instanceof File ? value : String(value));
          }
        });
        const response = await bulkCreate(formData).unwrap();
        const newFormData: SetInnType[] = response.map((item: SetInnType) => ({
          id: item.id,
          inn: "",
          name: item.name,
        }));
        setFormDataThird(newFormData);
      } catch (err) {
        toast.error("Ошибка при создании оборудования");
        console.error("Failed to create", err);
      }
    } else if (step === 3) {
      const payload = {
        equipments: formDataThird.map(({ id, inn }) => ({
          id,
          inn: Number(inn),
        })),
      };
      try {
        await bulkUpdateInn(payload).unwrap();
        toast.success("ИНН успешно обновлен");
        onOpenChange(false);
      } catch (err) {
        toast.error("Ошибка при обновлении ИНН");
        console.error("Failed to update INN", err);
      }
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderStep2Form = () => {
    const equipmentType = EQUIPMENT_TYPES[stepFormData.id];
    switch (equipmentType) {
      case "Компьютер":
        return (
          <DesktopForm equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
        );
      case "Проектор":
        return (
          <ProjectorAddForm equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
        );
      case "Принтер":
        return (
          <PrinterForm equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
        );
      case "Моноблок":
        return (
          <MonoBlokForm equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
        );
      case "Электронная доска":
        return (
          <ElectronBoardForm equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
        );
      case "Телевизор":
        return (
          <TvForm equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
        )
      case "Ноутбук":
        return (
          <LaptopForm equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
        );
      case "Роутер":
        return (
          <RouterForm equipmentFormData={equipmentFormData} setEquipmentFormData={setEquipmentFormData} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      {/* Step Progress Bar */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="w-1/3 text-center relative" onClick={() => setStep(1)}>
          <span className="text-md font-semibold text-white bg-indigo-600 px-3 p-1 rounded-md relative z-10">
            Общее
          </span>
          <div
            className={`h-1 ${step >= 1 ? "bg-indigo-600" : "bg-gray-200 dark:bg-zinc-800"} rounded absolute top-1/2 left-0 right-0 z-0`}
          />
        </div>
        <div className="w-1/3 text-center relative" onClick={() => setStep(2)}>
          <span
            className={`text-md ${step >= 2 ? "inline" : "hidden"} text-white bg-indigo-600 text-indigo p-1 rounded-md px-3 relative z-10`}
          >
            Характеристики
          </span>
          <div
            className={`h-1 ${step >= 2 ? "bg-indigo-600" : "bg-gray-200 dark:bg-zinc-800"} rounded absolute top-1/2 left-0 right-0 z-0`}
          />
        </div>
        <div className="w-1/3 text-center relative" onClick={() => setStep(3)}>
          <span
            className={`text-md ${step >= 3 ? "inline" : "hidden"} text-white bg-indigo-600 text-indigo p-1 rounded-md px-3 relative z-10`}
          >
            ИНН
          </span>
          <div
            className={`h-1 ${step >= 3 ? "bg-indigo-600" : "bg-gray-200 dark:bg-zinc-800"} rounded absolute top-1/2 left-0 right-0 z-0`}
          />
        </div>
      </div>

      {step === 1 && <StepOneForm data={equipmentFormData} setData={setEquipmentFormData} />}
      {step === 2 && renderStep2Form()} 
      {step === 3 && (
        <AddInnForm formDataThird={formDataThird} setFormDataThird={setFormDataThird} isLoading={isLoading} />
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6 gap-x-2">
        <Button
          disabled={step === 1}
          variant="default"
          className="gap-1 h-12 text-md flex-1 bg-indigo-600 text-accent-foreground hover:bg-indigo-500"
          onClick={handleBack}
        >
          Назад
        </Button>
        <Button
          variant="default"
          className="gap-1 h-12 text-md flex-1 bg-indigo-600 text-accent-foreground hover:bg-indigo-500"
          onClick={handleSubmit}
          disabled={
            (step === 1 && (!equipmentFormData.name_prefix || !equipmentFormData.status)) ||
            (step === 3 && formDataThird.some((item) => item.inn === ""))
          }
        >
          {step === 3 ? "Завершить" : "Далее"}
        </Button>
      </div>
    </div>
  );
};

export default StepForm;