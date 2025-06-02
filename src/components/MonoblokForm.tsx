import { type createFormPropsType, type MonoblokSpecs } from "@/types";
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
  useCreateMonoblokSpecsMutation,
  useGetMonoblokSpecsQuery,
} from "@/api/universityApi";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";
import { toast } from "react-toastify";

export const MonoBlokForm: React.FC<createFormPropsType> = ({
  equipmentFormData,
  setEquipmentFormData,
  create,
  onOpenChange,
}) => {
  const [createSpecMonoblok, { isLoading }] = useCreateMonoblokSpecsMutation();
  const [formData, setFormData] = useState<MonoblokSpecs>({
    cpu: "",
    ram: "",
    storage: "",
    has_keyboard: false,
    has_mouse: false,
    screen_size: "",
    model: "",
    touch_type: "infrared",
  });

  const { data: specs } = useGetMonoblokSpecsQuery();

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
        screen_size: selectedTemplate?.screen_size || "",
        model: selectedTemplate?.model || "",
        touch_type: formData.touch_type,
      });
      setEquipmentFormData((prev) => ({
        ...prev,
        monoblok_specification_id: Number(templateId),
        monoblok_char: null,
      }));
    } else {
      setEquipmentFormData((prev) => ({
        ...prev,
        monoblok_char: formData,
        monoblok_specification_id: null,
      }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (create && onOpenChange) {
      try {
        await createSpecMonoblok(formData).unwrap();
        toast.success("Спецификация моноблока успешно добавлена!");
        setFormData({
          cpu: "",
          ram: "",
          storage: "",
          has_keyboard: false,
          has_mouse: false,
          screen_size: "",
          model: "",
          touch_type: "infrared",
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
                      item.touch_type ==
                    "infrared"
                      ? "Инфракрасный"
                      : "Емкостный"}
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
              className="focus:ring-indigo-600 text-accent-foreground h-12 focus:border-indigo-600"
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
            className="gap-1 h-12 text-md flex-1 bg-indigo-600 text-accent-foreground hover:bg-indigo-500"
            onClick={() => onOpenChange(false)}
          >
            Назад
          </Button>
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 bg-indigo-600 text-accent-foreground hover:bg-indigo-500"
            onClick={(e) => handleSubmit(e)}
          >
            {isLoading ? <Loader2 className="animate animate-spin" /> : "Далее"}
          </Button>
        </div>
      )}
    </form>
  );
};
