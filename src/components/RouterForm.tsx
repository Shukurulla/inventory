import { type createFormPropsType, type RouterSpecs } from "@/types";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { useCreateRouterSpecsMutation, useGetRouterSpecsQuery } from "@/api/universityApi";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";

export const RouterForm: React.FC<createFormPropsType> = ({ equipmentFormData, setEquipmentFormData, create, onOpenChange }) => {
        const [createSpecRouter, { isLoading }] = useCreateRouterSpecsMutation();
    const [formData, setFormData] = useState<RouterSpecs>({
        model: '',
        ports: null,
        wifi_standart: '',
    })
    const handleInputChange = (field: keyof RouterSpecs, value: string | boolean | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const {data: specs} = useGetRouterSpecsQuery();
    
    const handleTemplateChange = (templateId: string) => {
        const selectedTemplate = specs?.find((item) => item?.id?.toString() === templateId.toString());
        if (selectedTemplate) {
            setFormData({
                model: selectedTemplate.model,
                ports: selectedTemplate.ports,
                wifi_standart: selectedTemplate.wifi_standart,
            });
            setEquipmentFormData((prev) => ({
                ...prev,
                router_specification_id: Number(templateId)
            }));
            setEquipmentFormData((prev) => ({
                ...prev, 
                notebook_char: null,
            })) 
        } else {
            setEquipmentFormData((prev) => ({
                ...prev, 
                router_char: formData,
                router_specification_id: null,
            })) 
        }
    };
    const handleSubmit = async (e:React.MouseEvent) => {
        e.preventDefault()
        if(create && onOpenChange){
            try {
                await createSpecRouter(formData).unwrap();
                toast.success("Спецификация роутера успешно добавлена!");
                setFormData({
                    model: '',
                    ports: null,
                    wifi_standart: '',
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
                    <Label htmlFor="cpu" className="text-black/40">Модель:</Label>
                    <Input
                        id="model"
                        placeholder="Введите..."
                        className="focus:ring-indigo-500 h-12 focus:border-indigo-500"
                        value={formData.model}
                        onChange={(e) => handleInputChange("model", e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 mt-5">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="monitorSize" className="text-black/40">Порты:</Label>
                    <Input
                        id="monitorSize"
                        type="number"
                        placeholder="Введите..."
                        className="focus:ring-indigo-600 h-12 focus:border-indigo-600"
                        value={formData.ports || ''}
                        onChange={(e) => handleInputChange("ports", Number(e.target.value))}
                    />
                </div>
            </div>
            <div className="flex-1 flex flex-col space-y-2">
                <Label htmlFor="w-_fi_standart" className="text-black/40">Стандарт Wi-Fi:</Label>
                <Select onValueChange={(value) => handleInputChange("wifi_standart", value)}>
                    <SelectTrigger className="w-full !h-12 border-gray-300 focus:ring-indigo-600 focus:border-indigo-600">
                        <SelectValue placeholder="Выберите тип сенсора" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="802.11ax">WiFi 6 (802.11ax)</SelectItem>
                        <SelectItem value="802.11be">WiFi 7 (802.11be)</SelectItem>
                    </SelectContent>
                </Select>
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
                                <SelectItem key={item?.id} value={item?.id?.toString() || index.toString()}>{item.model + ' ' + item.wifi_standart}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 flex flex-col space-y-2">
                    <Label htmlFor="quantity" className="text-black/40">Количество:</Label>
                    <Input
                        id="quantity"
                        placeholder="Введите..."
                        className="focus:ring-indigo-600 h-12 focus:border-indigo-600"
                        value={equipmentFormData.count}
                        onChange={(e) => setEquipmentFormData({...equipmentFormData, count: Number(e.target.value)})}
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