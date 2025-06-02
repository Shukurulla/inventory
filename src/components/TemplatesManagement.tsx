// src/components/TemplatesManagement.tsx
import { useState } from "react";
import { useGetEquipmentTypesQuery } from "@/api/universityApi";
import CharItem from "@/components/CharacteristicsItem";
import CharForm from "@/components/charForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomAccordion from "@/components/CustomAccordion";
import IconLabel from "@/components/ReusableIcon";
import DesktopIcon from "@/assets/Icons/DesktopIcon";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";
import type {
  TCompSpecifications,
  ProjectorSpecs,
  PrinterSpecs,
} from "@/types";

interface Template {
  id: number;
  title: string;
  type: string;
  data: any;
}

export const TemplatesManagement = () => {
  const { data: equipmentTypes } = useGetEquipmentTypesQuery();
  const [formVisible, setFormVisible] = useState(false);
  const [editTemplateModal, setEditTemplateModal] = useState(false);
  const [deleteTemplateModal, setDeleteTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [stepFormData, setStepFormData] = useState({
    name: "",
    id: 0,
  });

  // Mock templates data - В реальном проекте это будет из API
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 1,
      title: "Intel i5 8GB Lenovo ThinkPad",
      type: "Компьютер",
      data: {
        cpu: "Intel i5",
        ram: "8GB",
        storage: "256GB SSD",
        monitor_size: "15.6",
      },
    },
    {
      id: 2,
      title: "Intel i7 16GB Dell OptiPlex",
      type: "Компьютер",
      data: {
        cpu: "Intel i7",
        ram: "16GB",
        storage: "512GB SSD",
        monitor_size: "24",
      },
    },
    {
      id: 3,
      title: "Epson L3150 Цветной Duplex",
      type: "Принтер",
      data: { model: "Epson L3150", color: true, duplex: true },
    },
  ]);

  const groupTemplatesByType = () => {
    const grouped: { [key: string]: Template[] } = {};

    templates.forEach((template) => {
      if (!grouped[template.type]) {
        grouped[template.type] = [];
      }
      grouped[template.type].push(template);
    });

    return grouped;
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setEditTemplateModal(true);
  };

  const handleDeleteTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setDeleteTemplateModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedTemplate) {
      setTemplates((prev) => prev.filter((t) => t.id !== selectedTemplate.id));
      toast.success("Шаблон успешно удален!");
      setDeleteTemplateModal(false);
      setSelectedTemplate(null);
    }
  };

  const handleEditSave = () => {
    // В реальном проекте здесь будет API call
    toast.success("Шаблон успешно обновлен!");
    setEditTemplateModal(false);
    setSelectedTemplate(null);
  };

  const generateTemplateTitle = (type: string, data: any): string => {
    switch (type) {
      case "Компьютер":
        return `${data.cpu} ${data.ram} ${data.storage}`;
      case "Принтер":
        return `${data.model} ${data.color ? "Цветной" : "ЧБ"} ${
          data.duplex ? "Duplex" : "Simplex"
        }`;
      case "Проектор":
        return `${data.model} ${data.lumens}lm ${data.resolution}`;
      case "Ноутбук":
        return `${data.cpu} ${data.ram} ${data.monitor_size}"`;
      case "Моноблок":
        return `${data.cpu} ${data.ram} ${data.screen_size}"`;
      case "Телевизор":
        return `${data.model} ${data.screen_size}"`;
      case "Роутер":
        return `${data.model} ${data.wifi_standart}`;
      case "Электронная доска":
        return `${data.model} ${data.screen_size}" ${data.touch_type}`;
      default:
        return "Неизвестный шаблон";
    }
  };

  const groupedTemplates = groupTemplatesByType();

  return (
    <div>
      <div className="border-2 rounded-xl overflow-hidden mb-6">
        <div className="flex flex-row items-center p-4 border-b-2 bg-white z-10">
          <div className="flex items-center gap-2 text-xl font-medium w-full">
            <div className="flex flex-1 items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              </div>
              Создать шаблон
            </div>
            <div className="flex-1 text-center">
              <p>Наличие шаблонов</p>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>
        <div>
          {equipmentTypes?.map((item) => (
            <CharItem
              key={item.name}
              item={item}
              setStepFormData={setStepFormData}
              onPlusClick={() => setFormVisible(true)}
            />
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="border-2 rounded-xl overflow-hidden">
        <div className="flex flex-row items-center p-4 border-b-2 bg-white z-10">
          <div className="flex items-center gap-2 text-xl font-medium w-full">
            <div className="flex flex-1 items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              Созданные шаблоны
            </div>
            <div className="flex-1 text-center">
              <p>Количество</p>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>

        {Object.keys(groupedTemplates).length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg">Нет созданных шаблонов</p>
            <p className="text-sm">
              Создайте первый шаблон, используя форму выше
            </p>
          </div>
        ) : (
          Object.entries(groupedTemplates).map(([type, typeTemplates]) => (
            <CustomAccordion
              key={type}
              value={`templates-${type}`}
              className="bg-white dark:bg-zinc-950 border-t first:border-t-0"
              triggerContent={
                <>
                  <IconLabel
                    icon={() => (
                      <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-accent flex items-center justify-center">
                        <DesktopIcon color="#5CB8D1" className="w-6 h-6" />
                      </div>
                    )}
                    color="#000"
                    className="flex-1"
                    label={type}
                  />
                  <div className="flex-1 flex justify-center">
                    <div className="bg-green-50 dark:bg-zinc-900 dark:text-green-400 w-12 h-12 rounded-full flex items-center justify-center text-green-600 font-medium">
                      {typeTemplates.length}
                    </div>
                  </div>
                </>
              }
            >
              {typeTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex justify-between items-center p-4 border-b dark:border-b-accent bg-background first:border-t border-t-accent border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                        {template.type.charAt(0)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-accent-foreground text-lg font-medium">
                        {template.title}
                      </span>
                      <span className="text-sm text-gray-500">
                        {type} - ID: {template.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditTemplate(template)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTemplate(template)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </CustomAccordion>
          ))
        )}
      </div>

      {/* Modals */}
      {formVisible && (
        <CharForm stepFormData={stepFormData} onOpenChange={setFormVisible} />
      )}

      {/* Edit Template Modal */}
      <Dialog open={editTemplateModal} onOpenChange={setEditTemplateModal}>
        <DialogContent className="w-[50%]">
          <DialogHeader>
            <DialogTitle>Редактировать шаблон</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-title">Название шаблона</Label>
              <Input
                id="template-title"
                value={selectedTemplate?.title || ""}
                onChange={(e) => {
                  if (selectedTemplate) {
                    setSelectedTemplate({
                      ...selectedTemplate,
                      title: e.target.value,
                    });
                  }
                }}
                className="mt-1"
              />
            </div>
            {/* Add more fields based on template type */}
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setEditTemplateModal(false)}
            >
              Отменить
            </Button>
            <Button
              onClick={handleEditSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Сохранить
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Template Modal */}
      <Dialog open={deleteTemplateModal} onOpenChange={setDeleteTemplateModal}>
        <DialogContent className="w-[30%]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Trash2 className="h-6 w-6 text-red-500" />
              <span>Подтверждение удаления</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Вы уверены, что хотите удалить шаблон{" "}
              <span className="font-semibold">{selectedTemplate?.title}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Это действие нельзя отменить.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTemplateModal(false)}
            >
              Отменить
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Удалить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
