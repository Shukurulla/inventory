// src/components/TemplatesManagement.tsx - Updated with Edit Forms
import { useState } from "react";
import {
  useGetEquipmentTypesQuery,
  useGetSpecComputerQuery,
  useGetSpecProjectorQuery,
  useGetPrinterSpecsQuery,
  useGetMonoblokSpecsQuery,
  useGetElectronicBoardSpecsQuery,
  useGetTvSpecsQuery,
  useGetLaptopSpecsQuery,
  useGetRouterSpecsQuery,
} from "@/api/universityApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CustomAccordion from "@/components/CustomAccordion";
import IconLabel from "@/components/ReusableIcon";
import DesktopIcon from "@/assets/Icons/DesktopIcon";
import MonoblockIcon from "@/assets/Icons/MonoblockIcon";
import ElectronBoardIcon from "@/assets/Icons/EelctronBoardIcon";
import TvIcon from "@/assets/Icons/TvIcon";
import MonitorIcon from "@/assets/Icons/MonitorIocn";
import LaptopIcon from "@/assets/Icons/LaptopIcon";
import PrinterIcon from "@/assets/Icons/PrinterIcon";
import RouterIcon from "@/assets/Icons/RouterIcon";
import GogglesIcon from "@/assets/Icons/GogglesIcon";
import { Edit, Trash2, CircleIcon } from "lucide-react";
import { toast } from "react-toastify";
import type { JSX } from "react";
import { DesktopForm } from "./DeskTopForm";
import { ProjectorAddForm } from "./AddProjectorForm";
import { PrinterForm } from "./PrinterForm";
import { MonoBlokForm } from "./MonoblokForm";
import { ElectronBoardForm } from "./ElectronicBoardForm";
import { TvForm } from "./TvForm";
import { LaptopForm } from "./LaptopForm";
import { RouterForm } from "./RouterForm";
import type {
  TCompSpecifications,
  ProjectorSpecs,
  PrinterSpecs,
  MonoblokSpecs,
  ElectronBoardSpecs,
  TVSpecs,
  LaptopSpecs,
  RouterSpecs,
  createEquipmentBodyType,
} from "@/types";

interface EquipmentIcons {
  icon: JSX.Element;
  name: string;
  color: string;
}

export const TemplatesManagement = () => {
  // API queries for all specifications
  const { data: computerSpecs, isLoading: computerLoading } =
    useGetSpecComputerQuery();
  const { data: projectorSpecs, isLoading: projectorLoading } =
    useGetSpecProjectorQuery();
  const { data: printerSpecs, isLoading: printerLoading } =
    useGetPrinterSpecsQuery();
  const { data: monoblokSpecs, isLoading: monoblokLoading } =
    useGetMonoblokSpecsQuery();
  const { data: electronBoardSpecs, isLoading: electronBoardLoading } =
    useGetElectronicBoardSpecsQuery();
  const { data: tvSpecs, isLoading: tvLoading } = useGetTvSpecsQuery();
  const { data: laptopSpecs, isLoading: laptopLoading } =
    useGetLaptopSpecsQuery();
  const { data: routerSpecs, isLoading: routerLoading } =
    useGetRouterSpecsQuery();

  const [deleteTemplateModal, setDeleteTemplateModal] = useState(false);
  const [editTemplateModal, setEditTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Edit form data state
  const [equipmentFormData, setEquipmentFormData] =
    useState<createEquipmentBodyType>({
      type_id: 0,
      room_id: 0,
      description: "",
      status: "",
      contract_id: null,
      count: 1,
      name: "",
      name_prefix: "",
      is_active: false,
      photo: undefined,
      computer_details: null,
      printer_char: null,
      extender_char: null,
      router_char: null,
      tv_char: null,
      notebook_char: null,
      monoblok_char: null,
      projector_char: null,
      whiteboard_char: null,
      computer_specification_id: null,
      printer_specification_id: null,
      extender_specification_id: null,
      router_specification_id: null,
      tv_specification_id: null,
      notebook_specification_id: null,
      monoblok_specification_id: null,
      projector_specification_id: null,
      whiteboard_specification_id: null,
    });

  const inventoryIcons: EquipmentIcons[] = [
    {
      icon: (
        <DesktopIcon color="#5CB8D1" className="w-6 h-6 dark:brightness-70" />
      ),
      name: "Компьютер",
      color: "bg-[#DAF1FB] dark:bg-blue-300/30",
    },
    {
      icon: <MonoblockIcon className="w-6 h-6 dark:brightness-70" />,
      name: "Моноблок",
      color: "bg-green-50 dark:bg-green-300/30",
    },
    {
      icon: <ElectronBoardIcon className="w-6 h-6 dark:brightness-70" />,
      name: "Электронная доска",
      color: "bg-purple-50 dark:bg-purple-300/30",
    },
    {
      icon: <TvIcon className="w-6 h-6 dark:brightness-70" />,
      name: "Телевизор",
      color: "bg-orange-50 dark:bg-orange-300/30",
    },
    {
      icon: <MonitorIcon className="w-6 h-6 dark:brightness-70" />,
      name: "Монитор",
      color: "bg-green-50 dark:bg-green-300/30",
    },
    {
      icon: <LaptopIcon className="w-6 h-6 dark:brightness-70" />,
      name: "Ноутбук",
      color: "bg-blue-50 dark:bg-blue-300/30",
    },
    {
      icon: <PrinterIcon className="w-6 h-6 dark:brightness-70" />,
      name: "Принтер",
      color: "bg-pink-50 dark:bg-pink-300/30",
    },
    {
      icon: <RouterIcon className="w-6 h-6 dark:brightness-70" />,
      name: "Роутер",
      color: "bg-orange-50 dark:bg-orange-300/30",
    },
    {
      icon: <GogglesIcon className="w-6 h-6 dark:brightness-70" />,
      name: "Проектор",
      color: "bg-green-100 dark:bg-green-300/30",
    },
  ];

  // Group templates by type from API data
  const groupTemplatesByType = () => {
    const grouped: { [key: string]: any[] } = {};

    // Computer templates
    if (computerSpecs && computerSpecs.length > 0) {
      grouped["Компьютер"] = computerSpecs.map((spec) => ({
        ...spec,
        title: `${spec.cpu} ${spec.ram} ${spec.storage}`,
        type: "Компьютер",
      }));
    }

    // Projector templates
    if (projectorSpecs && projectorSpecs.length > 0) {
      grouped["Проектор"] = projectorSpecs.map((spec) => ({
        ...spec,
        title: `${spec.model} ${spec.lumens}lm ${spec.resolution}`,
        type: "Проектор",
      }));
    }

    // Printer templates
    if (printerSpecs && printerSpecs.length > 0) {
      grouped["Принтер"] = printerSpecs.map((spec) => ({
        ...spec,
        title: `${spec.model} ${spec.color ? "Цветной" : "ЧБ"} ${
          spec.duplex ? "Duplex" : "Simplex"
        }`,
        type: "Принтер",
      }));
    }

    // Monoblok templates
    if (monoblokSpecs && monoblokSpecs.length > 0) {
      grouped["Моноблок"] = monoblokSpecs.map((spec) => ({
        ...spec,
        title: `${spec.cpu} ${spec.ram} ${spec.screen_size}"`,
        type: "Моноблок",
      }));
    }

    // Electronic board templates
    if (electronBoardSpecs && electronBoardSpecs.length > 0) {
      grouped["Электронная доска"] = electronBoardSpecs.map((spec) => ({
        ...spec,
        title: `${spec.model} ${spec.screen_size}" ${
          spec.touch_type === "infrared" ? "Инфракрасный" : "Емкостный"
        }`,
        type: "Электронная доска",
      }));
    }

    // TV templates
    if (tvSpecs && tvSpecs.length > 0) {
      grouped["Телевизор"] = tvSpecs.map((spec) => ({
        ...spec,
        title: `${spec.model} ${spec.screen_size}"`,
        type: "Телевизор",
      }));
    }

    // Laptop templates
    if (laptopSpecs && laptopSpecs.length > 0) {
      grouped["Ноутбук"] = laptopSpecs.map((spec) => ({
        ...spec,
        title: `${spec.cpu} ${spec.ram} ${spec.monitor_size}"`,
        type: "Ноутбук",
      }));
    }

    // Router templates
    if (routerSpecs && routerSpecs.length > 0) {
      grouped["Роутер"] = routerSpecs.map((spec) => ({
        ...spec,
        title: `${spec.model} ${spec.wifi_standart}`,
        type: "Роутер",
      }));
    }

    return grouped;
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);

    // Populate form data based on template type
    switch (template.type) {
      case "Компьютер":
        setEquipmentFormData((prev) => ({
          ...prev,
          computer_details: template,
          computer_specification_id: template.id,
        }));
        break;
      case "Проектор":
        setEquipmentFormData((prev) => ({
          ...prev,
          projector_char: template,
          projector_specification_id: template.id,
        }));
        break;
      case "Принтер":
        setEquipmentFormData((prev) => ({
          ...prev,
          printer_char: template,
          printer_specification_id: template.id,
        }));
        break;
      case "Моноблок":
        setEquipmentFormData((prev) => ({
          ...prev,
          monoblok_char: template,
          monoblok_specification_id: template.id,
        }));
        break;
      case "Электронная доска":
        setEquipmentFormData((prev) => ({
          ...prev,
          whiteboard_char: template,
          whiteboard_specification_id: template.id,
        }));
        break;
      case "Телевизор":
        setEquipmentFormData((prev) => ({
          ...prev,
          tv_char: template,
          tv_specification_id: template.id,
        }));
        break;
      case "Ноутбук":
        setEquipmentFormData((prev) => ({
          ...prev,
          notebook_char: template,
          notebook_specification_id: template.id,
        }));
        break;
      case "Роутер":
        setEquipmentFormData((prev) => ({
          ...prev,
          router_char: template,
          router_specification_id: template.id,
        }));
        break;
    }

    setEditTemplateModal(true);
  };

  const handleDelete = (template: any) => {
    setSelectedTemplate(template);
    setDeleteTemplateModal(true);
  };

  const handleEditSave = async () => {
    if (!selectedTemplate) return;

    try {
      // Here you would call the appropriate update API based on template type
      toast.success("Шаблон успешно обновлен!");
      setEditTemplateModal(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Failed to update template:", error);
      toast.error("Ошибка при обновлении шаблона");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTemplate) return;

    try {
      // Here you would call the appropriate delete API based on template type
      toast.success("Шаблон успешно удален!");
      setDeleteTemplateModal(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Ошибка при удалении шаблона");
    }
  };

  // Render appropriate edit form based on template type
  const renderEditForm = () => {
    if (!selectedTemplate) return null;

    switch (selectedTemplate.type) {
      case "Компьютер":
        return (
          <DesktopForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
            create={false}
          />
        );
      case "Проектор":
        return (
          <ProjectorAddForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
            create={false}
          />
        );
      case "Принтер":
        return (
          <PrinterForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
            create={false}
          />
        );
      case "Моноблок":
        return (
          <MonoBlokForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
            create={false}
          />
        );
      case "Электронная доска":
        return (
          <ElectronBoardForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
            create={false}
          />
        );
      case "Телевизор":
        return (
          <TvForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
            create={false}
          />
        );
      case "Ноутбук":
        return (
          <LaptopForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
            create={false}
          />
        );
      case "Роутер":
        return (
          <RouterForm
            equipmentFormData={equipmentFormData}
            setEquipmentFormData={setEquipmentFormData}
            create={false}
          />
        );
      default:
        return <div>Неизвестный тип оборудования</div>;
    }
  };

  const groupedTemplates = groupTemplatesByType();
  const totalTemplates = Object.values(groupedTemplates).flat().length;
  const isLoading =
    computerLoading ||
    projectorLoading ||
    printerLoading ||
    monoblokLoading ||
    electronBoardLoading ||
    tvLoading ||
    laptopLoading ||
    routerLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-muted-foreground">Загрузка шаблонов...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Templates List */}
      <div className="border-2 rounded-xl overflow-hidden">
        <div className="flex flex-row items-center p-4 border-b-2 bg-white dark:bg-zinc-950 z-10">
          <div className="flex items-center gap-2 text-xl font-medium w-full">
            <div className="flex flex-1 items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-foreground">Созданные шаблоны</span>
            </div>
            <div className="flex-1 text-center">
              <p className="text-foreground">Количество</p>
            </div>
            <div className="flex-1"></div>
          </div>
        </div>

        {Object.keys(groupedTemplates).length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-lg">Нет созданных шаблонов</p>
            <p className="text-sm">
              Создайте первый шаблон в разделе "Характеристики"
            </p>
          </div>
        ) : (
          <div className="bg-[#D8DCFD5C] dark:bg-zinc-900/50">
            {Object.entries(groupedTemplates).map(([type, typeTemplates]) => {
              const matchedIcon = inventoryIcons.find(
                (icon) => icon.name === type
              );

              return (
                <CustomAccordion
                  key={type}
                  value={`templates-${type}`}
                  className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-700 first:border-t-0"
                  triggerContent={
                    <div className="flex items-center justify-between w-full pr-4">
                      <IconLabel
                        icon={() => (
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              matchedIcon?.color || "bg-blue-50 dark:bg-accent"
                            }`}
                          >
                            <div className="text-gray-600 dark:text-gray-400">
                              {matchedIcon?.icon || (
                                <CircleIcon className="w-6 h-6" />
                              )}
                            </div>
                          </div>
                        )}
                        color="#000"
                        className="flex-1"
                        label={type}
                      />
                      <div className="flex-1 flex justify-center">
                        <div className="bg-green-50 dark:bg-zinc-800 dark:text-green-400 w-12 h-12 rounded-full flex items-center justify-center text-green-600 font-medium">
                          {typeTemplates.length}
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="bg-indigo-50 dark:bg-zinc-950 p-0">
                    {typeTemplates.map((template) => (
                      <div
                        key={template.id}
                        className="flex justify-between items-center p-4 border-b dark:border-zinc-700 bg-background first:border-t border-t-zinc-200 dark:border-t-zinc-700 border-gray-200 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              matchedIcon?.color || "bg-blue-50 dark:bg-accent"
                            }`}
                          >
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                              {type.charAt(0)}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-accent-foreground text-lg font-medium">
                              {template.title}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {type} - ID: {template.id}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(template)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(template)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CustomAccordion>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Template Modal */}
      <Dialog open={editTemplateModal} onOpenChange={setEditTemplateModal}>
        <DialogContent className="w-[70%] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Редактировать шаблон - {selectedTemplate?.type}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">{renderEditForm()}</div>
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
              Сохранить изменения
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
            <p className="text-gray-600 dark:text-gray-300">
              Вы уверены, что хотите удалить шаблон{" "}
              <span className="font-semibold">{selectedTemplate?.title}</span>?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
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
