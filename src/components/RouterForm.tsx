import { type createFormPropsType, type RouterSpecs } from "@/types";
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
  useCreateRouterSpecsMutation,
  useGetRouterSpecsQuery,
} from "@/api/universityApi";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";

export const RouterForm: React.FC<createFormPropsType> = ({
  equipmentFormData,
  setEquipmentFormData,
  create,
  onOpenChange,
}) => {
  const [createSpecRouter, { isLoading }] = useCreateRouterSpecsMutation();
  const [formData, setFormData] = useState<RouterSpecs>({
    model: "",
    ports: null,
    wifi_standart: "",
  });

  const { data: specs } = useGetRouterSpecsQuery();

  const handleTemplateChange = (templateId: string) => {
    const selectedTemplate = specs?.find(
      (item) => item?.id?.toString() === templateId.toString()
    );
    if (selectedTemplate) {
      setFormData({
        model: selectedTemplate.model,
        ports: selectedTemplate.ports,
        wifi_standart: selectedTemplate.wifi_standart,
      });
      setEquipmentFormData((prev) => ({
        ...prev,
        router_specification_id: Number(templateId),
        router_char: null,
      }));
    } else {
      setEquipmentFormData((prev) => ({
        ...prev,
        router_char: formData,
        router_specification_id: null,
      }));
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Router: Submit clicked");
    console.log("Router: create =", create);
    console.log("Router: onOpenChange =", onOpenChange);
    console.log("Router: formData =", formData);

    if (create && onOpenChange) {
      try {
        console.log("Router: Calling API with data:", formData);
        await createSpecRouter(formData).unwrap();
        toast.success("Спецификация роутера успешно добавлена!");
        setFormData({
          model: "",
          ports: null,
          wifi_standart: "",
        });
        onOpenChange(false);
      } catch (error) {
        console.error("Router: API error:", error);
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
            <Label htmlFor="router-model">Модель роутер</Label>
            <Input
              id="router-model"
              placeholder="TP-Link Archer AX6000"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="router-ports">Количество портов</Label>
            <Input
              id="router-ports"
              type="number"
              placeholder="8"
              value={formData.ports || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ports: parseInt(e.target.value) || null,
                })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="router-wifi">Стандарт Wi-Fi</Label>
            <Select
              value={formData.wifi_standart}
              onValueChange={(value) =>
                setFormData({ ...formData, wifi_standart: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Выберите WiFi стандарт" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="802.11n">802.11n (2.4 GHz)</SelectItem>
                <SelectItem value="802.11ac">802.11ac (5 GHz)</SelectItem>
                <SelectItem value="802.11ax">802.11ax (WiFi 6)</SelectItem>
                <SelectItem value="802.11be">802.11be (WiFi 7)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="router-serial">Серийный номер</Label>
            <Input
              id="router-serial"
              placeholder="Серийный номер"
              className="mt-1"
            />
          </div>
          <div></div>
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
            disabled={!formData.model || !formData.wifi_standart}
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
                    key={item?.id}
                    value={item?.id?.toString() || index.toString()}
                  >
                    {item.model + " " + item.wifi_standart}
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
