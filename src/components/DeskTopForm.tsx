import { type createFormPropsType, type TCompSpecifications } from "@/types";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import {
  useCreateSpecComputerMutation,
  useGetSpecComputerQuery,
} from "@/api/universityApi";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";
import { Loader2 } from "lucide-react";

export const DesktopForm: React.FC<createFormPropsType> = ({
  equipmentFormData,
  setEquipmentFormData,
  create,
  onOpenChange,
}) => {
  const [createSpecComputer, { isLoading }] = useCreateSpecComputerMutation();
  const [formData, setFormData] = useState<TCompSpecifications>({
    cpu: "",
    ram: "",
    storage: "",
    has_keyboard: false,
    has_mouse: false,
    monitor_size: "",
  });

  const { data: specs } = useGetSpecComputerQuery();

  const handleTemplateChange = (templateId: string) => {
    const selectedTemplate = specs?.find(
      (item) => item?.id?.toString() === templateId.toString()
    );
    if (selectedTemplate) {
      setFormData({
        cpu: selectedTemplate.cpu,
        ram: selectedTemplate.ram,
        storage: selectedTemplate.storage,
        has_mouse: selectedTemplate.has_mouse,
        has_keyboard: selectedTemplate.has_keyboard,
        monitor_size: selectedTemplate.monitor_size,
      });
      setEquipmentFormData((prev) => ({
        ...prev,
        computer_specification_id: Number(templateId),
      }));
      setEquipmentFormData((prev) => ({
        ...prev,
        computer_details: null,
      }));
    } else {
      setEquipmentFormData((prev) => ({
        ...prev,
        computer_details: formData,
        computer_specification_id: null,
      }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (create && onOpenChange) {
      try {
        await createSpecComputer(formData).unwrap();
        toast.success("Спецификация компьютера успешно добавлена!");
        setFormData({
          cpu: "",
          ram: "",
          storage: "",
          has_keyboard: false,
          has_mouse: false,
          monitor_size: "",
        });
        onOpenChange(false);
      } catch (error) {
        errorValidatingWithToast(error);
      }
    }
  };

  return (
    <form className="">
      {!create && (
        <div className="flex col-span-1 pt-3 gap-3">
          <div className="flex-1 flex flex-col space-y-2">
            <Label htmlFor="template" className="text-black/40">
              Шаблон характеристики:
            </Label>
            <Select onValueChange={handleTemplateChange}>
              <SelectTrigger className="w-full !h-12 border-gray-300 focus:ring-indigo-600 focus:border-indigo-600">
                <SelectValue placeholder="Выберите шаблон" />
              </SelectTrigger>
              <SelectContent>
                {specs?.map((item, index) => (
                  <SelectItem
                    key={item.id}
                    value={item?.id?.toString() || index.toString()}
                  >
                    {item.cpu +
                      " " +
                      item.ram +
                      " " +
                      item.storage +
                      " " +
                      item.monitor_size +
                      "dyum"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 flex flex-col space-y-2">
            <Label htmlFor="quantity" className="text-black/40">
              Количество:
            </Label>
            <Input
              id="quantity"
              placeholder="Введите..."
              className="focus:ring-indigo-600 h-12 text-accent-foreground focus:border-indigo-600"
              value={equipmentFormData.count}
              onChange={(e) =>
                setEquipmentFormData({
                  ...equipmentFormData,
                  count: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
      )}
      {onOpenChange && create && (
        <div className="flex justify-between mt-6 gap-x-2">
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 text-accent-foreground bg-indigo-600 hover:bg-indigo-500"
            onClick={() => onOpenChange(false)}
          >
            Назад
          </Button>
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 text-accent-foreground bg-indigo-600 hover:bg-indigo-500"
            onClick={(e) => handleSubmit(e)}
          >
            {isLoading ? <Loader2 className="animate animate-spin" /> : "Далее"}
          </Button>
        </div>
      )}
    </form>
  );
};
