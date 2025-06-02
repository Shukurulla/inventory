import type { createFormPropsType, PrinterSpecs } from "@/types";
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
  useCreatePrinterSpecsMutation,
  useGetPrinterSpecsQuery,
} from "@/api/universityApi";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";
import { Loader2 } from "lucide-react";

export const PrinterForm: React.FC<createFormPropsType> = ({
  equipmentFormData,
  setEquipmentFormData,
  create,
  onOpenChange,
}) => {
  const [createSpecPrinter, { isLoading }] = useCreatePrinterSpecsMutation();
  const [formData, setFormData] = useState<PrinterSpecs>({
    model: "",
    color: false,
    duplex: false,
  });
  const { data: specs } = useGetPrinterSpecsQuery();

  const handleTemplateChange = (templateId: string) => {
    const selectedTemplate = specs?.find(
      (item) => item?.id?.toString() === templateId.toString()
    );
    if (selectedTemplate) {
      setFormData({
        model: selectedTemplate.model,
        color: selectedTemplate.color,
        duplex: selectedTemplate.duplex,
      });
      setEquipmentFormData((prev) => ({
        ...prev,
        printer_specification_id: Number(templateId),
        printer_char: null,
      }));
    } else {
      setEquipmentFormData((prev) => ({
        ...prev,
        printer_char: formData,
        printer_specification_id: null,
      }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (create && onOpenChange) {
      try {
        await createSpecPrinter(formData).unwrap();
        toast.success("Спецификация принтера успешно добавлена!");
        setFormData({
          model: "",
          color: false,
          duplex: false,
        });
        onOpenChange(false);
      } catch (error) {
        errorValidatingWithToast(error);
      }
    }
  };

  return (
    <form>
      {!create && (
        <div className="flex col-span-1 pt-3 gap-3">
          <div className="flex-1 flex flex-col space-y-2">
            <Label
              htmlFor="template"
              className="text-black/40 dark:text-accent-foreground"
            >
              Шаблон характеристики:
            </Label>
            <Select onValueChange={handleTemplateChange}>
              <SelectTrigger className="w-full border-gray-300 focus:ring-indigo-600 focus:border-indigo-600">
                <SelectValue placeholder="Выберите шаблон" />
              </SelectTrigger>
              <SelectContent>
                {specs?.map((item) => (
                  <SelectItem key={item.id} value={item?.id?.toString() || ""}>
                    {item.model +
                      " " +
                      (item.color ? "Цветной" : "Чёрно-белый")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 flex flex-col space-y-2">
            <Label
              htmlFor="quantity"
              className="text-black/40 dark:text-accent-foreground"
            >
              Количество:
            </Label>
            <Input
              id="quantity"
              placeholder="Введите..."
              className="focus:ring-indigo-600 focus:border-indigo-600"
              value={equipmentFormData.count}
              onChange={(e) =>
                setEquipmentFormData((prev) => ({
                  ...prev,
                  count: Number(e.target.value),
                }))
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
