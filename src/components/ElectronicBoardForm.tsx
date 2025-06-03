import { type createFormPropsType, type ElectronBoardSpecs } from "@/types";
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
  useCreateElectronicBoardSpecsMutation,
  useGetElectronicBoardSpecsQuery,
} from "@/api/universityApi";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";

export const ElectronBoardForm: React.FC<createFormPropsType> = ({
  equipmentFormData,
  setEquipmentFormData,
  create,
  onOpenChange,
}) => {
  const [createSpecElectronicBoard, { isLoading }] =
    useCreateElectronicBoardSpecsMutation();

  const [formData, setFormData] = useState<ElectronBoardSpecs>({
    model: "",
    screen_size: null,
    touch_type: "infrared",
  });

  const { data: specs } = useGetElectronicBoardSpecsQuery();

  const handleTemplateChange = (templateId: string) => {
    const selectedTemplate = specs?.find(
      (item) => item?.id?.toString() === templateId.toString()
    );
    if (selectedTemplate) {
      setFormData({
        model: selectedTemplate.model,
        screen_size: Number(selectedTemplate.screen_size),
        touch_type: selectedTemplate.touch_type,
      });
      setEquipmentFormData((prev) => ({
        ...prev,
        whiteboard_specification_id: Number(templateId),
        whiteboard_char: null,
      }));
    } else {
      setEquipmentFormData((prev) => ({
        ...prev,
        whiteboard_char: formData,
        whiteboard_specification_id: null,
      }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("ElectronicBoard: Submit clicked");
    console.log("ElectronicBoard: create =", create);
    console.log("ElectronicBoard: onOpenChange =", onOpenChange);
    console.log("ElectronicBoard: formData =", formData);

    if (create && onOpenChange) {
      try {
        console.log("ElectronicBoard: Calling API with data:", formData);
        await createSpecElectronicBoard(formData).unwrap();
        toast.success("Спецификация электронной доски успешно добавлена!");
        setFormData({
          model: "",
          screen_size: null,
          touch_type: "infrared",
        });
        onOpenChange(false);
      } catch (error) {
        console.error("ElectronicBoard: API error:", error);
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
            <Label htmlFor="whiteboard-model">Модель электронной доски</Label>
            <Input
              id="whiteboard-model"
              placeholder="SMART Board MX275"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="whiteboard-size">Размер экрана (дюймы)</Label>
            <Input
              id="whiteboard-size"
              type="number"
              placeholder="75"
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
            <Label htmlFor="whiteboard-touch">Тип сенсора</Label>
            <Select
              value={formData.touch_type}
              onValueChange={(value: "infrared" | "capacitive") =>
                setFormData({ ...formData, touch_type: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Выберите тип сенсора" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="infrared">Инфракрасный</SelectItem>
                <SelectItem value="capacitive">Емкостный</SelectItem>
              </SelectContent>
            </Select>
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
                    {item.model +
                      " " +
                      item.screen_size +
                      "dyum" +
                      " " +
                      (item.touch_type === "infrared"
                        ? "Инфракрасный"
                        : "Емкостный")}
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
