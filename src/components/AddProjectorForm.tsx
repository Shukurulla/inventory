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
import { useCreateSpecProjectorMutation, useGetSpecProjectorQuery } from "@/api/universityApi";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export const ProjectorAddForm:React.FC<createFormPropsType> = ({equipmentFormData, setEquipmentFormData, create, onOpenChange}) => {
   const [createSpecProjector, { isLoading }] = useCreateSpecProjectorMutation();
   
   const [formData, setFormData] = useState<ProjectorSpecs>({
        model: "",
        lumens: 0,
        resolution: "",
        throw_type: "standart",
    });
    const handleInputChange = (
      field: keyof ProjectorSpecs,
      value: string | boolean | number
   ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };
   const {data: specs} = useGetSpecProjectorQuery();

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
      }else{
         setEquipmentFormData((prev) => ({
            ...prev, 
            projector_char: formData,
            projector_specification_id: null,
         }));
      }
   };

   const handleSubmit = async (e:React.MouseEvent) => {
      e.preventDefault()
      if(create && onOpenChange){
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
               errorValidatingWithToast(error)
         }
      }
   };

   return (
      <form>
         <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-2 text-md">
               <Label htmlFor="model" className="text-black/40">
                  Модель:
               </Label>
               <Input
                  id="model"
                  placeholder="Введите..."
                  className="focus:ring-indigo-600 h-12 focus:border-indigo-600 text-accent-foreground"
                  value={formData?.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
               />
            </div>
            <div className="flex flex-col space-y-2 text-md">
               <Label htmlFor="lumens" className="text-black/40">
                  Яркость:
               </Label>
               <Input
                  id="lumens"
                  type="number"
                  placeholder="Введите..."
                  className="focus:ring-indigo-600 h-12 focus:border-indigo-600 text-accent-foreground"
                  value={formData?.lumens}
                  onChange={(e) => handleInputChange("lumens", e.target.value)}
               />
            </div>

            <div className="flex flex-col col-span-1 space-y-2">
               <Label htmlFor="resolution" className="text-black/40">
                  Разрешение:
               </Label>
               <Input
                  id="resolution"
                  placeholder="Введите..."
                  className="focus:ring-indigo-600 h-12 focus:border-indigo-600 text-accent-foreground"
                  value={formData?.resolution}
                  onChange={(e) => handleInputChange("resolution", e.target.value)}
               />
            </div>
            <div className="flex flex-col col-span-1 space-y-2">
               <Label htmlFor="throw type" className="text-black/40">
                  Тип проекции:
               </Label>
               <Select value={formData.throw_type} onValueChange={(value => handleInputChange("throw_type", value))}>
                  <SelectTrigger className="w-full !h-12 border-gray-300 focus:ring-indigo-600 focus:border-indigo-600">
                     <SelectValue placeholder="Выберите тип проекции:" />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="ultra-short">Сверхкороткофокусная проекция</SelectItem>
                     <SelectItem value="short">Короткофокусная проекция</SelectItem>
                     <SelectItem value="standard">Длиннофокусная проекция</SelectItem>
                  </SelectContent>
               </Select>
            </div>
         </div>
         {!create && <div className="flex col-span-1 pt-3 gap-3">
            <div className="flex-1 flex flex-col space-y-2">
               <Label htmlFor="template" className="text-black/40">
                  Шаблон характеристики:
               </Label>
               <Select 
                  onValueChange={handleTemplateChange}
                  >
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
                  onChange={(e) => setEquipmentFormData((prev) => ({...prev, count: Number(e.target.value)}))}
               />
            </div>
         </div>}
         {(onOpenChange && create) &&<div className="flex justify-between mt-6 gap-x-2">
               <Button
                  variant="default"
                  className="gap-1 h-12 text-md flex-1 bg-indigo-600 hover:bg-indigo-500"
                  onClick={() => onOpenChange(false)}
               >
                  Назад
               </Button>
               <Button
                    variant="default"
                    className="gap-1 h-12 text-md flex-1 bg-indigo-600 hover:bg-indigo-500"
                    onClick={(e) => handleSubmit(e)}
                >
                    {isLoading ? <Loader2 className="animate animate-spin"/> : 'Далее'}
                </Button>
         </div>}
      </form>
   );
};
