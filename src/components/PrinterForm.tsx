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
import { Checkbox } from "./ui/checkbox";

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

  if (create && onOpenChange) {
    // CREATE MODE: Show full form with input fields
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="printer-model">Модель принтера</Label>
            <Input
              id="printer-model"
              placeholder="HP LaserJet Pro M404dn"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="printer-type">Тип печати</Label>
            <Select
              value={formData.color ? "color" : "monochrome"}
              onValueChange={(value) =>
                setFormData({ ...formData, color: value === "color" })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Выберите тип печати" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monochrome">Чёрно-белый</SelectItem>
                <SelectItem value="color">Цветной</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Дополнительные возможности</Label>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="duplex"
              checked={formData.duplex}
              onCheckedChange={(checked: boolean) =>
                setFormData({ ...formData, duplex: checked as boolean })
              }
            />
            <Label htmlFor="duplex">Двусторонняя печать (Duplex)</Label>
          </div>
        </div>

        <div className="flex justify-between mt-6 gap-x-2">
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 text-accent-foreground bg-indigo-600 hover:bg-indigo-500"
            onClick={() => onOpenChange(false)}
          >
            Отменить
          </Button>
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 text-accent-foreground bg-indigo-600 hover:bg-indigo-500"
            onClick={(e) => handleSubmit(e)}
            disabled={!formData.model}
          >
            {isLoading ? (
              <Loader2 className="animate animate-spin" />
            ) : (
              "Создать шаблон"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // REGULAR MODE: Template selection + quantity (for equipment creation)
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
    </form>
  );
};
