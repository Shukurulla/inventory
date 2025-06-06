"use client";

// src/components/CreateInventoryForm.tsx - Fixed version
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useBulkCreateEquipmentMutation,
  useBulkUpdateInnMutation,
} from "@/api/universityApi";
import {
  EQUIPMENT_TYPES,
  type SetInnType,
  type createEquipmentBodyType,
} from "@/types";
import { toast } from "react-toastify";
import { StepOneForm } from "./FirstStepForm";
import AddInnForm from "./AddInnForm";
import DesktopForm from "./DeskTopForm";
import { ProjectorAddForm } from "./AddProjectorForm";
import { PrinterForm } from "./PrinterForm";
import { MonoBlokForm } from "./MonoblokForm";
import { ElectronBoardForm } from "./ElectronicBoardForm";
import { TvForm } from "./TvForm";
import { LaptopForm } from "./LaptopForm";
import { RouterForm } from "./RouterForm";
import { MonitorForm } from "./MonitorForm";

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
  const [equipmentFormData, setEquipmentFormData] =
    useState<createEquipmentBodyType>({
      type_id: Number(stepFormData.id),
      room_id: Number(stepFormData.roomId),
      description: "",
      status: "",
      contract_id: null,
      count: 1,
      name: "",
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
    });
  const [formDataThird, setFormDataThird] = useState<SetInnType[]>([]);
  const [bulkCreate, { isLoading }] = useBulkCreateEquipmentMutation();
  const [bulkUpdateInn] = useBulkUpdateInnMutation();

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleSubmit = async () => {
    if (step === 1) {
      handleNext();
      return;
    }

    if (step === 2) {
      try {
        console.log("Submitting equipment data:", equipmentFormData);

        // Create the proper request body according to BulkCreateEquipmentRequest interface
        const requestBody: any = {
          type_id: equipmentFormData.type_id,
          room_id: equipmentFormData.room_id,
          description: equipmentFormData.description,
          status: equipmentFormData.status,
          contract_id: equipmentFormData.contract_id,
          count: equipmentFormData.count,
          name_prefix: equipmentFormData.name_prefix,
          is_active: true, // Always set to true since we removed the checkbox
        };

        // Add equipment-specific specifications
        if (equipmentFormData.computer_details) {
          requestBody.computer_details = equipmentFormData.computer_details;
        }
        if (equipmentFormData.computer_specification_id) {
          requestBody.computer_specification_id =
            equipmentFormData.computer_specification_id;
        }
        if (equipmentFormData.projector_char) {
          requestBody.projector_char = equipmentFormData.projector_char;
        }
        if (equipmentFormData.projector_specification_id) {
          requestBody.projector_specification_id =
            equipmentFormData.projector_specification_id;
        }
        if (equipmentFormData.printer_char) {
          requestBody.printer_char = equipmentFormData.printer_char;
        }
        if (equipmentFormData.printer_specification_id) {
          requestBody.printer_specification_id =
            equipmentFormData.printer_specification_id;
        }
        if (equipmentFormData.monoblok_char) {
          requestBody.monoblok_char = equipmentFormData.monoblok_char;
        }
        if (equipmentFormData.monoblok_specification_id) {
          requestBody.monoblok_specification_id =
            equipmentFormData.monoblok_specification_id;
        }
        if (equipmentFormData.whiteboard_char) {
          requestBody.whiteboard_char = equipmentFormData.whiteboard_char;
        }
        if (equipmentFormData.whiteboard_specification_id) {
          requestBody.whiteboard_specification_id =
            equipmentFormData.whiteboard_specification_id;
        }
        if (equipmentFormData.tv_char) {
          requestBody.tv_char = equipmentFormData.tv_char;
        }
        if (equipmentFormData.tv_specification_id) {
          requestBody.tv_specification_id =
            equipmentFormData.tv_specification_id;
        }
        if (equipmentFormData.notebook_char) {
          requestBody.notebook_char = equipmentFormData.notebook_char;
        }
        if (equipmentFormData.notebook_specification_id) {
          requestBody.notebook_specification_id =
            equipmentFormData.notebook_specification_id;
        }
        if (equipmentFormData.router_char) {
          requestBody.router_char = equipmentFormData.router_char;
        }
        if (equipmentFormData.router_specification_id) {
          requestBody.router_specification_id =
            equipmentFormData.router_specification_id;
        }
        if (equipmentFormData.extender_char) {
          requestBody.extender_char = equipmentFormData.extender_char;
        }
        if (equipmentFormData.extender_specification_id) {
          requestBody.extender_specification_id =
            equipmentFormData.extender_specification_id;
        }

        console.log("Request body:", requestBody);

        const response = await bulkCreate(requestBody).unwrap();
        console.log("Bulk create response:", response);

        // Create INN form data from response
        const newFormData: SetInnType[] = response.map((item: any) => ({
          id: item.id,
          inn: "",
          name: item.name,
        }));

        setFormDataThird(newFormData);
        handleNext(); // Move to step 3
      } catch (err) {
        console.error("Failed to create equipment:", err);
        toast.error("Ошибка при создании оборудования");
      }
    } else if (step === 3) {
      try {
        const payload = {
          equipments: formDataThird.map(({ id, inn }) => ({
            id,
            inn: Number(inn),
          })),
        };

        console.log("Updating INN with payload:", payload);

        await bulkUpdateInn(payload).unwrap();
        toast.success("Оборудование успешно создано и ИНН обновлен!");

        // Close modal and reset form
        onOpenChange(false);
        // Instead of page reload, trigger a refetch of the data
        // This will be handled by React Query's refetchOnMount
      } catch (err) {
        console.error("Failed to update INN:", err);
        toast.error("Ошибка при обновлении ИНН");
      }
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const renderStep2Form = () => {
    const equipmentType = EQUIPMENT_TYPES[stepFormData.id];
    console.log(
      "Rendering form for equipment type:",
      equipmentType,
      "ID:",
      stepFormData.id
    );

    switch (equipmentType) {
      case "Компьютер":
        return (
          <DesktopForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Проектор":
        return (
          <ProjectorAddForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Принтер":
        return (
          <PrinterForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Моноблок":
        return (
          <MonoBlokForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Электронная доска":
        return (
          <ElectronBoardForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Телевизор":
        return (
          <TvForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Ноутбук":
        return (
          <LaptopForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Роутер":
        return (
          <RouterForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      case "Монитор":
        return (
          <MonitorForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
          />
        );
      default:
        return (
          <div>Форма для типа оборудования "{equipmentType}" не найдена</div>
        );
    }
  };

  // Check if step 1 form is valid
  const isStep1Valid = () => {
    return (
      equipmentFormData.name_prefix &&
      equipmentFormData.status &&
      equipmentFormData.name &&
      equipmentFormData.contract_id // Contract is now required
    );
  };

  // Check if step 3 form is valid
  const isStep3Valid = () => {
    return formDataThird.every((item) => item.inn !== "" && item.inn !== "0");
  };

  return (
    <div className="w-full mx-auto p-4">
      {/* Step Progress Bar */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div
          className="w-1/3 text-center relative"
          onClick={() => step > 1 && setStep(1)}
        >
          <span
            className={`text-md font-semibold px-3 p-1 rounded-md relative z-10 cursor-pointer ${
              step >= 1
                ? "text-white bg-indigo-600"
                : "text-gray-500 bg-gray-200"
            }`}
          >
            Общее
          </span>
          <div
            className={`h-1 ${
              step >= 1 ? "bg-indigo-600" : "bg-gray-200 dark:bg-zinc-800"
            } rounded absolute top-1/2 left-0 right-0 z-0`}
          />
        </div>
        <div
          className="w-1/3 text-center relative"
          onClick={() => step > 2 && setStep(2)}
        >
          <span
            className={`text-md ${
              step >= 2 ? "inline" : "hidden"
            } px-3 p-1 rounded-md relative z-10 cursor-pointer ${
              step >= 2
                ? "text-white bg-indigo-600"
                : "text-gray-500 bg-gray-200"
            }`}
          >
            Характеристики
          </span>
          <div
            className={`h-1 ${
              step >= 2 ? "bg-indigo-600" : "bg-gray-200 dark:bg-zinc-800"
            } rounded absolute top-1/2 left-0 right-0 z-0`}
          />
        </div>
        <div className="w-1/3 text-center relative">
          <span
            className={`text-md ${
              step >= 3 ? "inline" : "hidden"
            } px-3 p-1 rounded-md relative z-10 ${
              step >= 3
                ? "text-white bg-indigo-600"
                : "text-gray-500 bg-gray-200"
            }`}
          >
            ИНН
          </span>
          <div
            className={`h-1 ${
              step >= 3 ? "bg-indigo-600" : "bg-gray-200 dark:bg-zinc-800"
            } rounded absolute top-1/2 left-0 right-0 z-0`}
          />
        </div>
      </div>

      {/* Form Content */}
      {step === 1 && (
        <StepOneForm data={equipmentFormData} setData={setEquipmentFormData} />
      )}
      {step === 2 && renderStep2Form()}
      {step === 3 && (
        <AddInnForm
          formDataThird={formDataThird}
          setFormDataThird={setFormDataThird}
          isLoading={isLoading}
        />
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
            (step === 1 && !isStep1Valid()) ||
            (step === 3 && !isStep3Valid()) ||
            isLoading
          }
        >
          {isLoading ? "Загрузка..." : step === 3 ? "Завершить" : "Далее"}
        </Button>
      </div>
    </div>
  );
};

export default StepForm;
