import { type createFormPropsType, type LaptopSpecs } from "@/types";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { useCreateLaptopSpecsMutation, useGetLaptopSpecsQuery } from "@/api/universityApi";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";

export const LaptopForm: React.FC<createFormPropsType> = ({ equipmentFormData, setEquipmentFormData, create, onOpenChange }) => {
    const [createSpecLaptop, { isLoading }] = useCreateLaptopSpecsMutation();
    const [formData, setFormData] = useState<LaptopSpecs>({
        cpu: '',
        ram: '',
        storage: '',
        monitor_size: '',
    })
    const handleInputChange = (field: keyof LaptopSpecs, value: string | boolean | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const {data: specs} = useGetLaptopSpecsQuery();
    
    const handleTemplateChange = (templateId: string) => {
        const selectedTemplate = specs?.find((item) => item?.id?.toString() === templateId.toString());
        if (selectedTemplate) {
            setFormData({
                cpu: selectedTemplate.cpu,
                ram: selectedTemplate.ram,
                storage: selectedTemplate.storage,
                monitor_size: selectedTemplate?.monitor_size || '',
            });
            setEquipmentFormData((prev) => ({
                ...prev,
                notebook_specification_id: Number(templateId)
            }));
            setEquipmentFormData((prev) => ({
                ...prev, 
                notebook_char: null,
            })) 
        } else {
            setEquipmentFormData((prev) => ({
                ...prev, 
                notebook_char: formData,
                notebook_specification_id: null,
            })) 
        }
    };
    
    const handleSubmit = async (e:React.MouseEvent) => {
        e.preventDefault()
        if(create && onOpenChange){
            try {
                await createSpecLaptop(formData).unwrap();
                toast.success("Спецификация ноутбука успешно добавлена!");
                setFormData({
                    cpu: '',
                    ram: '',
                    storage: '',
                    monitor_size: '',
                });
                onOpenChange(false);
            } catch (error) {
                errorValidatingWithToast(error)
            }
        }
    };
    
    return (
        <form className="">
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2 text-md">
                    <Label htmlFor="cpu" className="text-black/40">Процессор:</Label>
                    <Input
                        id="cpu"
                        placeholder="Введите..."
                        className="focus:ring-indigo-500 text-accent-foreground h-12 focus:border-indigo-500"
                        value={formData.cpu}
                        onChange={(e) => handleInputChange("cpu", e.target.value)}
                    />
                </div>
                <div className="flex flex-col space-y-2 text-md">
                    <Label htmlFor="ram" className="text-black/40">Оперативная память:</Label>
                    <Input
                        id="ram"
                        placeholder="Введите..."
                        className="focus:ring-indigo-500 text-accent-foreground h-12 focus:border-indigo-500"
                        value={formData.ram}
                        onChange={(e) => handleInputChange("ram", e.target.value)}
                    />
                </div>

                <div className="flex flex-col col-span-1 space-y-2">
                    <Label htmlFor="storage" className="text-black/40">Накопитель (SSD/HDD):</Label>
                    <Input
                        id="storage"
                        placeholder="Введите..."
                        className="focus:ring-indigo-500 text-accent-foreground h-12 focus:border-indigo-500"
                        value={formData.storage}
                        onChange={(e) => handleInputChange("storage", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="monitorSize" className="text-black/40">Размер монитора:</Label>
                    <Input
                        id="monitorSize"
                        type="number"
                        placeholder="Введите..."
                        className="focus:ring-indigo-600 text-accent-foreground h-12 focus:border-indigo-600"
                        value={formData.monitor_size}
                        onChange={(e) => handleInputChange("monitor_size", Number(e.target.value))}
                    />
                </div>
            </div>

            {!create && <div className="flex col-span-1 pt-3 gap-3">
                <div className="flex-1 flex flex-col space-y-2">
                    <Label htmlFor="template" className="text-black/40">Шаблон характеристики:</Label>
                    <Select onValueChange={handleTemplateChange}>
                        <SelectTrigger className="w-full !h-12 border-gray-300 focus:ring-indigo-600 focus:border-indigo-600">
                            <SelectValue placeholder="Выберите шаблон"/>
                        </SelectTrigger>
                        <SelectContent>
                            {specs?.map((item, index) => (
                                <SelectItem key={item?.id} value={item?.id?.toString() || index.toString()}>{item.cpu + ' ' + item.ram + " " + item.storage}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 flex flex-col space-y-2">
                    <Label htmlFor="quantity" className="text-black/40">Количество:</Label>
                    <Input
                        id="quantity"
                        placeholder="Введите..."
                        className="focus:ring-indigo-600 text-accent-foreground h-12 focus:border-indigo-600"
                        value={equipmentFormData.count}
                        onChange={(e) => setEquipmentFormData({...equipmentFormData, count: Number(e.target.value)})}
                    />
                </div>
            </div>}
            {(onOpenChange && create) &&<div className="flex justify-between mt-6 gap-x-2">
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
                    {isLoading ? <Loader2 className="animate animate-spin"/> : 'Далее'}
                </Button>
            </div>}
        </form>
    );
};