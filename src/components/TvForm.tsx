import { type createFormPropsType, type TVSpecs } from "@/types";
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
  useCreateTvSpecsMutation,
  useGetTvSpecsQuery,
} from "@/api/universityApi";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";

export const TvForm: React.FC<createFormPropsType> = ({
  equipmentFormData,
  setEquipmentFormData,
  create,
  onOpenChange,
}) => {
  const [createSpecTv, { isLoading }] = useCreateTvSpecsMutation();

  const [formData, setFormData] = useState<TVSpecs>({
    model: "",
    screen_size: null,
  });

  const { data: specs } = useGetTvSpecsQuery();

  const handleTemplateChange = (templateId: string) => {
    const selectedTemplate = specs?.find(
      (item) => item?.id?.toString() === templateId.toString()
    );
    if (selectedTemplate) {
      setFormData({
        model: selectedTemplate.model,
        screen_size: Number(selectedTemplate.screen_size),
      });
      setEquipmentFormData((prev) => ({
        ...prev,
        tv_specification_id: Number(templateId),
        tv_char: null,
      }));
    } else {
      setEquipmentFormData((prev) => ({
        ...prev,
        tv_char: formData,
        tv_specification_id: null,
      }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("TV: Submit clicked");
    console.log("TV: create =", create);
    console.log("TV: onOpenChange =", onOpenChange);
    console.log("TV: formData =", formData);

    if (create && onOpenChange) {
      try {
        console.log("TV: Calling API with data:", formData);
        await createSpecTv(formData).unwrap();
        toast.success("Спецификация телевизора успешно добавлена!");
        setFormData({
          model: "",
          screen_size: null,
        });
        onOpenChange(false);
      } catch (error) {
        console.error("TV: API error:", error);
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
            <Label htmlFor="tv-model">Модель телевизора</Label>
            <Input
              id="tv-model"
              placeholder="Samsung UE55AU7100U"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tv-size">Размер экрана (дюймы)</Label>
            <Input
              id="tv-size"
              type="number"
              placeholder="55"
              value={formData.screen_size || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  screen_size: parseFloat(e.target.value) || null,
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="tv-serial">Серийный номер</Label>
            <Input
              id="tv-serial"
              placeholder="Серийный номер"
              className="mt-1"
            />
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
            disabled={!formData.model || !formData.screen_size}
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
                    {item.model + " " + item.screen_size + "dyum"}
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
    </form>
  );
};
