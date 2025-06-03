import type { createFormPropsType, ProjectorSpecs } from "@/types";
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
  useCreateSpecProjectorMutation,
  useGetSpecProjectorQuery,
} from "@/api/universityApi";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export const ProjectorAddForm: React.FC<createFormPropsType> = ({
  equipmentFormData,
  setEquipmentFormData,
  create,
  onOpenChange,
}) => {
  const [createSpecProjector, { isLoading }] = useCreateSpecProjectorMutation();

  const [formData, setFormData] = useState<ProjectorSpecs>({
    model: "",
    lumens: 0,
    resolution: "",
    throw_type: "standart",
  });

  const { data: specs } = useGetSpecProjectorQuery();

  const handleTemplateChange = (templateId: string) => {
    const selectedTemplate = specs?.find(
      (item) => item?.id?.toString() === templateId.toString()
    );
    if (selectedTemplate) {
      setFormData({
        model: selectedTemplate.model,
        lumens: selectedTemplate.lumens,
        resolution: selectedTemplate.resolution,
        throw_type: selectedTemplate.throw_type,
      });
      setEquipmentFormData((prev) => ({
        ...prev,
        projector_specification_id: Number(templateId),
        projector_char: null,
      }));
    } else {
      setEquipmentFormData((prev) => ({
        ...prev,
        projector_char: formData,
        projector_specification_id: null,
      }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (create && onOpenChange) {
      try {
        await createSpecProjector(formData).unwrap();
        toast.success("Спецификация проектора успешно добавлена!");
        setFormData({
          model: "",
          lumens: 0,
          resolution: "",
          throw_type: "standart",
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
            <Label htmlFor="projector-model">Модель проектора</Label>
            <Input
              id="projector-model"
              placeholder="Epson EB-X51"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="projector-lumens">Яркость (люмены)</Label>
            <Input
              id="projector-lumens"
              type="number"
              placeholder="3800"
              value={formData.lumens || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  lumens: parseInt(e.target.value) || 0,
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="projector-resolution">Разрешение</Label>
            <Select
              value={formData.resolution}
              onValueChange={(value) =>
                setFormData({ ...formData, resolution: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Выберите разрешение" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                <SelectItem value="1024x768">1024x768 (XGA)</SelectItem>
                <SelectItem value="800x600">800x600 (SVGA)</SelectItem>
                <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="projector-throw">Тип проекции</Label>
            <Select
              value={formData.throw_type}
              onValueChange={(value) =>
                setFormData({ ...formData, throw_type: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Выберите тип проекции" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standart">Стандартная проекция</SelectItem>
                <SelectItem value="short">Короткофокусная</SelectItem>
                <SelectItem value="ultra_short">
                  Ультракороткофокусная
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between mt-6 gap-x-2">
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 bg-indigo-600 hover:bg-indigo-500"
            onClick={() => onOpenChange(false)}
          >
            Отменить
          </Button>
          <Button
            variant="default"
            className="gap-1 h-12 text-md flex-1 bg-indigo-600 hover:bg-indigo-500"
            onClick={(e) => handleSubmit(e)}
            disabled={
              !formData.model || !formData.lumens || !formData.resolution
            }
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
            <Label htmlFor="template" className="text-black/40">
              Шаблон характеристики:
            </Label>
            <Select onValueChange={handleTemplateChange}>
              <SelectTrigger className="w-full border-gray-300 focus:ring-indigo-600 focus:border-indigo-600">
                <SelectValue placeholder="Выберите шаблон" />
              </SelectTrigger>
              <SelectContent>
                {specs?.map((item) => (
                  <SelectItem key={item.id} value={item?.id?.toString() || ""}>
                    {item.model + " " + item.throw_type + " " + item.lumens}
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
              className="focus:ring-indigo-600 focus:border-indigo-600 text-accent-foreground"
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
