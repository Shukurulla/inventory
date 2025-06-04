// src/components/TemplatesManagement.tsx - Fixed edit functionality
import { useState } from "react";
import {
  useGetSpecComputerQuery,
  useGetSpecProjectorQuery,
  useGetPrinterSpecsQuery,
  useGetMonoblokSpecsQuery,
  useGetElectronicBoardSpecsQuery,
  useGetTvSpecsQuery,
  useGetLaptopSpecsQuery,
  useGetRouterSpecsQuery,
  // Add update mutations
  useUpdateSpecComputerMutation,
  useUpdateSpecProjectorMutation,
  useUpdatePrinterSpecsMutation,
  useUpdateMonoblokSpecsMutation,
  useUpdateElectronicBoardSpecsMutation,
  useUpdateTvSpecsMutation,
  useUpdateLaptopSpecsMutation,
  useUpdateRouterSpecsMutation,
} from "@/api/universityApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Edit, Trash2, CircleIcon, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import type { JSX } from "react";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";

interface EquipmentIcons {
  icon: JSX.Element;
  name: string;
  color: string;
}

export const TemplatesManagement = () => {
  // API queries for all specifications
  const {
    data: computerSpecs,
    isLoading: computerLoading,
    refetch: refetchComputer,
  } = useGetSpecComputerQuery();
  const {
    data: projectorSpecs,
    isLoading: projectorLoading,
    refetch: refetchProjector,
  } = useGetSpecProjectorQuery();
  const {
    data: printerSpecs,
    isLoading: printerLoading,
    refetch: refetchPrinter,
  } = useGetPrinterSpecsQuery();
  const {
    data: monoblokSpecs,
    isLoading: monoblokLoading,
    refetch: refetchMonoblok,
  } = useGetMonoblokSpecsQuery();
  const {
    data: electronBoardSpecs,
    isLoading: electronBoardLoading,
    refetch: refetchElectronBoard,
  } = useGetElectronicBoardSpecsQuery();
  const {
    data: tvSpecs,
    isLoading: tvLoading,
    refetch: refetchTv,
  } = useGetTvSpecsQuery();
  const {
    data: laptopSpecs,
    isLoading: laptopLoading,
    refetch: refetchLaptop,
  } = useGetLaptopSpecsQuery();
  const {
    data: routerSpecs,
    isLoading: routerLoading,
    refetch: refetchRouter,
  } = useGetRouterSpecsQuery();

  // Update mutations
  const [updateComputer, { isLoading: isUpdatingComputer }] =
    useUpdateSpecComputerMutation();
  const [updateProjector, { isLoading: isUpdatingProjector }] =
    useUpdateSpecProjectorMutation();
  const [updatePrinter, { isLoading: isUpdatingPrinter }] =
    useUpdatePrinterSpecsMutation();
  const [updateMonoblok, { isLoading: isUpdatingMonoblok }] =
    useUpdateMonoblokSpecsMutation();
  const [updateElectronBoard, { isLoading: isUpdatingElectronBoard }] =
    useUpdateElectronicBoardSpecsMutation();
  const [updateTv, { isLoading: isUpdatingTv }] = useUpdateTvSpecsMutation();
  const [updateLaptop, { isLoading: isUpdatingLaptop }] =
    useUpdateLaptopSpecsMutation();
  const [updateRouter, { isLoading: isUpdatingRouter }] =
    useUpdateRouterSpecsMutation();

  const [deleteTemplateModal, setDeleteTemplateModal] = useState(false);
  const [editTemplateModal, setEditTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Edit form data state - will hold the actual values to edit
  const [editFormData, setEditFormData] = useState<any>({});

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

    // Set the form data to the current template values for editing
    setEditFormData({ ...template });
    setEditTemplateModal(true);
  };

  const handleDelete = (template: any) => {
    setSelectedTemplate(template);
    setDeleteTemplateModal(true);
  };

  const handleEditSave = async () => {
    if (!selectedTemplate || !editFormData) return;

    try {
      const templateType = selectedTemplate.type;
      const templateId = selectedTemplate.id;

      // Prepare only changed fields for PATCH request
      const getChangedFields = (original: any, updated: any) => {
        const changes: any = {};
        Object.keys(updated).forEach((key) => {
          if (
            key !== "id" &&
            key !== "type" &&
            key !== "title" &&
            original[key] !== updated[key]
          ) {
            changes[key] = updated[key];
          }
        });
        return changes;
      };

      const changedFields = getChangedFields(selectedTemplate, editFormData);

      // Only proceed if there are actual changes
      if (Object.keys(changedFields).length === 0) {
        toast.info("Нет изменений для сохранения");
        return;
      }

      console.log("Sending PATCH request with changed fields:", changedFields);

      // Call appropriate update API based on template type with only changed fields
      switch (templateType) {
        case "Компьютер":
          await updateComputer({
            id: templateId,
            data: changedFields,
          }).unwrap();
          refetchComputer();
          break;

        case "Проектор":
          await updateProjector({
            id: templateId,
            data: changedFields,
          }).unwrap();
          refetchProjector();
          break;

        case "Принтер":
          await updatePrinter({
            id: templateId,
            data: changedFields,
          }).unwrap();
          refetchPrinter();
          break;

        case "Моноблок":
          await updateMonoblok({
            id: templateId,
            data: changedFields,
          }).unwrap();
          refetchMonoblok();
          break;

        case "Электронная доска":
          await updateElectronBoard({
            id: templateId,
            data: changedFields,
          }).unwrap();
          refetchElectronBoard();
          break;

        case "Телевизор":
          await updateTv({
            id: templateId,
            data: changedFields,
          }).unwrap();
          refetchTv();
          break;

        case "Ноутбук":
          await updateLaptop({
            id: templateId,
            data: changedFields,
          }).unwrap();
          refetchLaptop();
          break;

        case "Роутер":
          await updateRouter({
            id: templateId,
            data: changedFields,
          }).unwrap();
          refetchRouter();
          break;

        default:
          throw new Error("Unknown template type");
      }

      toast.success("Шаблон успешно обновлен!");
      setEditTemplateModal(false);
      setSelectedTemplate(null);
      setEditFormData({});
    } catch (error) {
      console.error("Failed to update template:", error);
      errorValidatingWithToast(error);
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

  // Render appropriate edit form based on template type with current values
  const renderEditForm = () => {
    if (!selectedTemplate || !editFormData) return null;

    switch (selectedTemplate.type) {
      case "Компьютер":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-cpu">Процессор (CPU)</Label>
                <Input
                  id="edit-cpu"
                  value={editFormData.cpu || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, cpu: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-ram">Оперативная память (RAM)</Label>
                <Input
                  id="edit-ram"
                  value={editFormData.ram || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, ram: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-storage">Накопитель</Label>
                <Input
                  id="edit-storage"
                  value={editFormData.storage || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      storage: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-monitor_size">Размер монитора</Label>
                <Input
                  id="edit-monitor_size"
                  value={editFormData.monitor_size || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      monitor_size: e.target.value,
                    })
                  }
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Дополнительное оборудование</Label>
              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-has_keyboard"
                    checked={editFormData.has_keyboard || false}
                    onCheckedChange={(checked) =>
                      setEditFormData({
                        ...editFormData,
                        has_keyboard: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="edit-has_keyboard">
                    Клавиатура в комплекте
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-has_mouse"
                    checked={editFormData.has_mouse || false}
                    onCheckedChange={(checked) =>
                      setEditFormData({
                        ...editFormData,
                        has_mouse: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="edit-has_mouse">Мышь в комплекте</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case "Проектор":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-model">Модель проектора</Label>
                <Input
                  id="edit-model"
                  value={editFormData.model || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, model: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-lumens">Яркость (люмены)</Label>
                <Input
                  id="edit-lumens"
                  type="number"
                  value={editFormData.lumens || ""}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      lumens: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-resolution">Разрешение</Label>
                <Select
                  value={editFormData.resolution || ""}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, resolution: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Выберите разрешение" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1920x1080">
                      1920x1080 (Full HD)
                    </SelectItem>
                    <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                    <SelectItem value="1024x768">1024x768 (XGA)</SelectItem>
                    <SelectItem value="800x600">800x600 (SVGA)</SelectItem>
                    <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-throw">Тип проекции</Label>
                <Select
                  value={editFormData.throw_type || ""}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, throw_type: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Выберите тип проекции" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standart">
                      Стандартная проекция
                    </SelectItem>
                    <SelectItem value="short">Короткофокусная</SelectItem>
                    <SelectItem value="ultra_short">
                      Ультракороткофокусная
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "Принтер":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-printer-model">Модель принтера</Label>
                <Input
                  id="edit-printer-model"
                  value={editFormData.model || ""}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, model: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="edit-printer-type">Тип печати</Label>
                <Select
                  value={editFormData.color ? "color" : "monochrome"}
                  onValueChange={(value) =>
                    setEditFormData({
                      ...editFormData,
                      color: value === "color",
                    })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Выберите тип печати" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monochrome">Чёрно-белый</SelectItem>
                    <SelectItem value="color">Цветной</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Дополнительные возможности</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-duplex"
                  checked={editFormData.duplex || false}
                  onCheckedChange={(checked) =>
                    setEditFormData({
                      ...editFormData,
                      duplex: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="edit-duplex">
                  Двусторонняя печать (Duplex)
                </Label>
              </div>
            </div>
          </div>
        );

      // Add other equipment types similar to above...
      default:
        return (
          <div>
            Редактирование для этого типа оборудования пока не реализовано
          </div>
        );
    }
  };

  const groupedTemplates = groupTemplatesByType();
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
              onClick={() => {
                setEditTemplateModal(false);
                setSelectedTemplate(null);
                setEditFormData({});
              }}
              disabled={
                isUpdatingComputer ||
                isUpdatingProjector ||
                isUpdatingPrinter ||
                isUpdatingMonoblok ||
                isUpdatingElectronBoard ||
                isUpdatingTv ||
                isUpdatingLaptop ||
                isUpdatingRouter
              }
            >
              Отменить
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={
                isUpdatingComputer ||
                isUpdatingProjector ||
                isUpdatingPrinter ||
                isUpdatingMonoblok ||
                isUpdatingElectronBoard ||
                isUpdatingTv ||
                isUpdatingLaptop ||
                isUpdatingRouter
              }
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isUpdatingComputer ||
              isUpdatingProjector ||
              isUpdatingPrinter ||
              isUpdatingMonoblok ||
              isUpdatingElectronBoard ||
              isUpdatingTv ||
              isUpdatingLaptop ||
              isUpdatingRouter ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Сохранение...
                </>
              ) : (
                "Сохранить изменения"
              )}
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
              onClick={() => {
                setDeleteTemplateModal(false);
                setSelectedTemplate(null);
              }}
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
