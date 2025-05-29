import { type createFormPropsType, type ElectronBoardSpecs } from "@/types";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { useCreateElectronicBoardSpecsMutation, useGetElectronicBoardSpecsQuery} from "@/api/universityApi";
import type React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";

export const ElectronBoardForm: React.FC<createFormPropsType> = ({ equipmentFormData, setEquipmentFormData, create, onOpenChange }) => {
        const [createSpecEelctronicBoard, { isLoading }] = useCreateElectronicBoardSpecsMutation();
    
    const [formData, setFormData] = useState<ElectronBoardSpecs>({
        model: '',
        screen_size: null,
        touch_type: 'infrared',
    })
    const handleInputChange = (field: keyof ElectronBoardSpecs, value: string | boolean | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const {data: specs} = useGetElectronicBoardSpecsQuery();
    
    const handleTemplateChange = (templateId: string) => {
        const selectedTemplate = specs?.find((item) => item?.id?.toString() === templateId.toString());
        if (selectedTemplate) {
            setFormData({
                model: selectedTemplate.model,
                screen_size: Number(selectedTemplate.screen_size),
                touch_type: formData.touch_type,
            });
            setEquipmentFormData((prev) => ({
                ...prev,
                whiteboard_specification_id: Number(templateId)
            }));
            setEquipmentFormData((prev) => ({
                ...prev, 
                whiteboard_char: null,
            })) 
        } else {
            setEquipmentFormData((prev) => ({
                ...prev, 
                whiteboard_char: formData,
                whiteboard_specification_id: null,
            })) 
        }
    };

    const handleSubmit = async (e:React.MouseEvent) => {
            e.preventDefault()
            if(create && onOpenChange){
                try {
                    await createSpecEelctronicBoard(formData).unwrap();
                    toast.success("Спецификация электронной доски успешно добавлена!");
                    setFormData({
                        model: '',
                        screen_size: null,
                        touch_type: 'infrared'
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
                    <Label htmlFor="model" className="text-black/40">Модель:</Label>
                    <Input
                        id="model"
                        placeholder="Введите..."
                        className="focus:ring-indigo-500 h-12 text-accent-foreground focus:border-indigo-500"
                        value={formData.model}
                        onChange={(e) => handleInputChange("model", e.target.value)}
                    />
                </div>
                <div className="flex flex-col space-y-2 text-md">
                    <Label htmlFor="screen_size" className="text-black/40">Размер монитора:</Label>
                    <Input
                        id="screen_size"
                        type="number"
                        placeholder="Введите..."
                        className="focus:ring-indigo-500 h-12 text-accent-foreground focus:border-indigo-500"
                        value={formData.screen_size || ''}
                        onChange={(e) => handleInputChange("screen_size", Number(e.target.value))}
                    />
                </div>
                <div className="flex-1 flex flex-col space-y-2">
                    <Label htmlFor="touchType" className="text-black/40">Тип сенсора:</Label>
                    <Select onValueChange={(value) => handleInputChange("touch_type", value)}>
                        <SelectTrigger className="w-full !h-12 border-gray-300 focus:ring-indigo-600 focus:border-indigo-600">
                            <SelectValue placeholder="Выберите тип сенсора" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="infrared">Инфракрасный</SelectItem>
                            <SelectItem value="capacitive">Емкостный</SelectItem>
                        </SelectContent>
                    </Select>
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
                                <SelectItem key={item.id} value={item?.id?.toString() || index.toString()}>{item.model+ ' '  + item.screen_size+'dyum' + ' ' + item.touch_type == 'infrared' ? 'Инфракрасный' : 'Емкостный'}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex-1 flex flex-col space-y-2">
                    <Label htmlFor="quantity" className="text-black/40">Количество:</Label>
                    <Input
                        id="quantity"
                        placeholder="Введите..."
                        className="focus:ring-indigo-600 h-12 text-accent-foreground focus:border-indigo-600"
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