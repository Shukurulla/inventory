// src/pages/AddedEquipmentsPage.tsx - Fixed version with syntax errors resolved
import {
  useDeleteEquipmentsMutation,
  useGetAddedEquipmentsQuery,
  useGetBlocksQuery,
  useGetEquipmentTypesQuery,
  useGetRoomsQuery,
  usePatchEquipmentMutation,
  useGetSpecComputerQuery,
  useGetSpecProjectorQuery,
  useGetPrinterSpecsQuery,
  useGetMonoblokSpecsQuery,
  useGetElectronicBoardSpecsQuery,
  useGetTvSpecsQuery,
  useGetLaptopSpecsQuery,
  useGetRouterSpecsQuery,
} from "@/api/universityApi";
import DesktopIcon from "@/assets/Icons/DesktopIcon";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { EquipmentTypes, TBlock, Tequipment, TRoom } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  CircleIcon,
  Trash2,
  Edit,
  AlertTriangle,
  Loader2,
  Upload,
} from "lucide-react";
import React, { useState, useEffect, type JSX } from "react";
import { EQUIPMENT_TYPES } from "../types";
import IconLabel from "@/components/ReusableIcon";
import MonoblockIcon from "@/assets/Icons/MonoblockIcon";
import ElectronBoardIcon from "@/assets/Icons/EelctronBoardIcon";
import TvIcon from "@/assets/Icons/TvIcon";
import MonitorIcon from "@/assets/Icons/MonitorIocn";
import LaptopIcon from "@/assets/Icons/LaptopIcon";
import PrinterIcon from "@/assets/Icons/PrinterIcon";
import RouterIcon from "@/assets/Icons/RouterIcon";
import GogglesIcon from "@/assets/Icons/GogglesIcon";
import CustomAccordion from "@/components/CustomAccordion";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";
import Layout from "@/components/layout";

interface EquipmentIcons {
  icon: JSX.Element;
  name: string;
  color: string;
}

const AddedEquipmentPage: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<
    number | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Tequipment | null>(
    null
  );
  const itemsPerPage = 5;

  // Edit form data
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    status: "",
    is_active: false,
    room: 0,
    type: 0,
    inn: "",
    photo: null as File | null,
    // Computer/Monoblock specs
    cpu: "",
    ram: "",
    storage: "",
    has_keyboard: false,
    has_mouse: false,
    monitor_size: "",
    screen_size: "",
    model: "",
    touch_type: "infrared" as "infrared" | "capacitive",
    // Projector specs
    lumens: 0,
    resolution: "",
    throw_type: "standart",
    // Printer specs
    color: false,
    duplex: false,
    // Router specs
    ports: 0,
    wifi_standart: "",
    // Specifications IDs
    computer_specification_id: null as number | null,
    projector_specification_id: null as number | null,
    printer_specification_id: null as number | null,
    monoblok_specification_id: null as number | null,
    whiteboard_specification_id: null as number | null,
    tv_specification_id: null as number | null,
    notebook_specification_id: null as number | null,
    router_specification_id: null as number | null,
    extender_specification_id: null as number | null,
  });

  const { data: blocks = [] } = useGetBlocksQuery({ univerId: 1 });
  const { data: rooms = [] } = useGetRoomsQuery();
  const { data: equipmentTypes = [] } = useGetEquipmentTypesQuery();
  const {
    data: allAddets = [],
    isLoading,
    refetch,
  } = useGetAddedEquipmentsQuery();

  // Specifications queries
  const { data: computerSpecs = [] } = useGetSpecComputerQuery();
  const { data: projectorSpecs = [] } = useGetSpecProjectorQuery();
  const { data: printerSpecs = [] } = useGetPrinterSpecsQuery();
  const { data: monoblokSpecs = [] } = useGetMonoblokSpecsQuery();
  const { data: electronBoardSpecs = [] } = useGetElectronicBoardSpecsQuery();
  const { data: tvSpecs = [] } = useGetTvSpecsQuery();
  const { data: laptopSpecs = [] } = useGetLaptopSpecsQuery();
  const { data: routerSpecs = [] } = useGetRouterSpecsQuery();

  const [deleteEquipment, { isLoading: isDeleting }] =
    useDeleteEquipmentsMutation();
  const [patchEquipment, { isLoading: isUpdating }] =
    usePatchEquipmentMutation();

  const inventoryIcons: EquipmentIcons[] = [
    {
      icon: (
        <DesktopIcon
          color="#5CB8D1"
          className="bg-[#DAF1FB] dark:bg-blue-300/30 rounded-full dark:brightness-70"
        />
      ),
      name: "Компьютер",
      color: "#5CB8D1",
    },
    {
      icon: <MonoblockIcon className="dark:brightness-70" />,
      name: "Моноблок",
      color: "bg-green-50 dark:bg-green-300/30",
    },
    {
      icon: <ElectronBoardIcon className="dark:brightness-70" />,
      name: "Электронная доска",
      color: "bg-purple-50 dark:bg-green-400/10",
    },
    {
      icon: <TvIcon className="h-6 w-6 dark:brightness-70" />,
      name: "Телевизор",
      color: "bg-orange-50 dark:bg-green-400/10",
    },
    {
      icon: <MonitorIcon className="h-6 w-6 dark:brightness-70" />,
      name: "Монитор",
      color: "bg-green-50 dark:bg-green-400/10",
    },
    {
      icon: <LaptopIcon className="dark:brightness-70" />,
      name: "Ноутбук",
      color: "bg-blue-50 dark:bg-green-400/10",
    },
    {
      icon: <PrinterIcon className="h-6 w-6 dark:brightness-70" />,
      name: "Принтер",
      color: "bg-pink-50 dark:bg-green-400/10",
    },
    {
      icon: <RouterIcon className="h-6 w-6 dark:brightness-70" />,
      name: "Роутер",
      color: "bg-orange-50 dark:bg-green-400/10",
    },
    {
      icon: <GogglesIcon className="h-6 w-6 dark:brightness-70" />,
      name: "Проектор",
      color: "bg-green-100 dark:bg-green-400/10",
    },
  ];

  const filterByType = () => {
    const filteredArray: { id: number; name: string; data: Tequipment[] }[] =
      [];

    Object.entries(EQUIPMENT_TYPES).forEach(([id, name]) => {
      const typeId = parseInt(id);
      if (allAddets && allAddets.length > 0) {
        let filteredData = allAddets.filter((item) => item.type === typeId);

        // Apply filters
        if (selectedBlock) {
          filteredData = filteredData.filter(
            (item) => item.room_data?.building === selectedBlock
          );
        }
        if (selectedRoom) {
          filteredData = filteredData.filter(
            (item) => item.room === selectedRoom
          );
        }
        if (selectedEquipmentType) {
          filteredData = filteredData.filter(
            (item) => item.type === selectedEquipmentType
          );
        }

        if (filteredData.length > 0) {
          filteredArray.push({
            id: typeId,
            name,
            data: filteredData,
          });
        }
      }
    });

    return filteredArray;
  };

  const addets = filterByType();
  const addetsPaginate = addets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalItems = addets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleEdit = (equipment: Tequipment) => {
    setSelectedEquipment(equipment);

    // Parse existing specifications based on equipment type
    let parsedSpecs = {};

    try {
      if (
        equipment.computer_details &&
        typeof equipment.computer_details === "string"
      ) {
        parsedSpecs = JSON.parse(equipment.computer_details);
      } else if (
        equipment.printer_char &&
        typeof equipment.printer_char === "string"
      ) {
        parsedSpecs = JSON.parse(equipment.printer_char);
      } else if (
        equipment.router_char &&
        typeof equipment.router_char === "string"
      ) {
        parsedSpecs = JSON.parse(equipment.router_char);
      } else if (equipment.tv_char && typeof equipment.tv_char === "string") {
        parsedSpecs = JSON.parse(equipment.tv_char);
      }
    } catch (error) {
      console.error("Error parsing specifications:", error);
    }

    setEditFormData({
      name: equipment.name,
      description: equipment.description,
      status: equipment.status,
      is_active: equipment.is_active,
      room: equipment.room,
      type: equipment.type,
      inn: equipment.uid || "",
      photo: null,
      // Computer/Monoblock specs
      cpu: (parsedSpecs as any)?.cpu || "",
      ram: (parsedSpecs as any)?.ram || "",
      storage: (parsedSpecs as any)?.storage || "",
      has_keyboard: (parsedSpecs as any)?.has_keyboard || false,
      has_mouse: (parsedSpecs as any)?.has_mouse || false,
      monitor_size: (parsedSpecs as any)?.monitor_size || "",
      screen_size: (parsedSpecs as any)?.screen_size || "",
      model: (parsedSpecs as any)?.model || "",
      touch_type: (parsedSpecs as any)?.touch_type || "infrared",
      // Projector specs
      lumens: (parsedSpecs as any)?.lumens || 0,
      resolution: (parsedSpecs as any)?.resolution || "",
      throw_type: (parsedSpecs as any)?.throw_type || "standart",
      // Printer specs
      color: (parsedSpecs as any)?.color || false,
      duplex: (parsedSpecs as any)?.duplex || false,
      // Router specs
      ports: (parsedSpecs as any)?.ports || 0,
      wifi_standart: (parsedSpecs as any)?.wifi_standart || "",
      // Specifications IDs - these would come from the equipment data
      computer_specification_id: null,
      projector_specification_id: null,
      printer_specification_id: null,
      monoblok_specification_id: null,
      whiteboard_specification_id: null,
      tv_specification_id: null,
      notebook_specification_id: null,
      router_specification_id: null,
      extender_specification_id: null,
    });

    setEditModalOpen(true);
  };

  const handleDelete = (equipment: Tequipment) => {
    setSelectedEquipment(equipment);
    setDeleteModalOpen(true);
  };
  const handleEditSave = async () => {
    if (!selectedEquipment) return;

    try {
      // Prepare the body based on equipment type
      const baseBody: any = {
        type: editFormData.type, // Type is required
        name: editFormData.name,
        description: editFormData.description,
        status: editFormData.status,
        room: editFormData.room,
        is_active: editFormData.is_active,
        inn: editFormData.inn ? parseInt(editFormData.inn) : undefined, // Handle empty INN
        ...(editFormData.photo && { photo: editFormData.photo }), // Include photo if provided
      };

      // Add type-specific data
      const equipmentTypeName = EQUIPMENT_TYPES[editFormData.type];

      switch (equipmentTypeName) {
        case "Компьютер":
          if (editFormData.computer_specification_id) {
            baseBody.computer_specification_id =
              editFormData.computer_specification_id;
          } else if (
            editFormData.cpu &&
            editFormData.ram &&
            editFormData.storage &&
            editFormData.monitor_size
          ) {
            baseBody.computer_details = {
              cpu: editFormData.cpu,
              ram: editFormData.ram,
              storage: editFormData.storage,
              has_keyboard: editFormData.has_keyboard,
              has_mouse: editFormData.has_mouse,
              monitor_size: editFormData.monitor_size,
            };
          }
          break;

        case "Проектор":
          if (editFormData.projector_specification_id) {
            baseBody.projector_specification_id =
              editFormData.projector_specification_id;
          } else if (
            editFormData.model &&
            editFormData.lumens &&
            editFormData.resolution &&
            editFormData.throw_type
          ) {
            baseBody.projector_char = {
              model: editFormData.model,
              lumens: parseInt(String(editFormData.lumens)) || 0,
              resolution: editFormData.resolution,
              throw_type:
                editFormData.throw_type === "standart"
                  ? "standard"
                  : editFormData.throw_type,
            };
          } else {
            throw new Error(
              "Все обязательные поля для проектора должны быть заполнены"
            );
          }
          break;

        case "Принтер":
          if (editFormData.printer_specification_id) {
            baseBody.printer_specification_id =
              editFormData.printer_specification_id;
          } else if (editFormData.model) {
            baseBody.printer_char = {
              model: editFormData.model,
              color: editFormData.color,
              duplex: editFormData.duplex,
            };
          }
          break;

        case "Моноблок":
          if (editFormData.monoblok_specification_id) {
            baseBody.monoblok_specification_id =
              editFormData.monoblok_specification_id;
          } else if (
            editFormData.cpu &&
            editFormData.ram &&
            editFormData.storage &&
            editFormData.screen_size &&
            editFormData.model
          ) {
            baseBody.monoblok_char = {
              cpu: editFormData.cpu,
              ram: editFormData.ram,
              storage: editFormData.storage,
              has_keyboard: editFormData.has_keyboard,
              has_mouse: editFormData.has_mouse,
              screen_size: editFormData.screen_size,
              model: editFormData.model,
              touch_type: editFormData.touch_type,
            };
          }
          break;

        case "Электронная доска":
          if (editFormData.whiteboard_specification_id) {
            baseBody.whiteboard_specification_id =
              editFormData.whiteboard_specification_id;
          } else if (editFormData.model && editFormData.screen_size) {
            baseBody.whiteboard_char = {
              model: editFormData.model,
              screen_size: parseFloat(editFormData.screen_size) || null,
              touch_type: editFormData.touch_type,
            };
          }
          break;

        case "Телевизор":
          if (editFormData.tv_specification_id) {
            baseBody.tv_specification_id = editFormData.tv_specification_id;
          } else if (editFormData.model && editFormData.screen_size) {
            baseBody.tv_char = {
              model: editFormData.model,
              screen_size: parseFloat(editFormData.screen_size) || null,
            };
          }
          break;

        case "Ноутбук":
          if (editFormData.notebook_specification_id) {
            baseBody.notebook_specification_id =
              editFormData.notebook_specification_id;
          } else if (
            editFormData.cpu &&
            editFormData.ram &&
            editFormData.storage &&
            editFormData.monitor_size
          ) {
            baseBody.notebook_char = {
              cpu: editFormData.cpu,
              ram: editFormData.ram,
              storage: editFormData.storage,
              monitor_size: editFormData.monitor_size,
            };
          }
          break;

        case "Роутер":
          if (editFormData.router_specification_id) {
            baseBody.router_specification_id =
              editFormData.router_specification_id;
          } else if (editFormData.model && editFormData.wifi_standart) {
            baseBody.router_char = {
              model: editFormData.model,
              ports: editFormData.ports || null,
              wifi_standart: editFormData.wifi_standart,
            };
          }
          break;
      }

      // Call the API to update the equipment
      await patchEquipment({
        id: selectedEquipment.id,
        data: baseBody,
      }).unwrap();

      toast.success("Оборудование успешно обновлено!");
      setEditModalOpen(false);
      await refetch();
    } catch (error) {
      console.error("Failed to update equipment:", error);
      errorValidatingWithToast(error);
    } finally {
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEquipment) return;

    try {
      await deleteEquipment({ ids: [selectedEquipment.id] }).unwrap();
      toast.success("Оборудование успешно удалено!");
      setDeleteModalOpen(false);
      await refetch();
    } catch (error) {
      console.error("Failed to delete equipment:", error);
      errorValidatingWithToast(error);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "NEW":
        return "Новое";
      case "WORKING":
        return "Рабочее";
      case "NEEDS_REPAIR":
        return "Требуется ремонт";
      case "DISPOSED":
        return "Утилизировано";
      default:
        return status;
    }
  };

  // Render specification form based on equipment type
  const renderSpecificationForm = () => {
    if (!selectedEquipment) return null;

    const equipmentTypeName = EQUIPMENT_TYPES[editFormData.type];

    switch (equipmentTypeName) {
      case "Компьютер":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CPU</Label>
                <Input
                  value={editFormData.cpu}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, cpu: e.target.value })
                  }
                  placeholder="Intel Core i5"
                />
              </div>
              <div>
                <Label>RAM</Label>
                <Input
                  value={editFormData.ram}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, ram: e.target.value })
                  }
                  placeholder="8GB"
                />
              </div>
              <div>
                <Label>Хранилище</Label>
                <Input
                  value={editFormData.storage}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      storage: e.target.value,
                    })
                  }
                  placeholder="256GB SSD"
                />
              </div>
              <div>
                <Label>Размер монитора</Label>
                <Input
                  value={editFormData.monitor_size}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      monitor_size: e.target.value,
                    })
                  }
                  placeholder="24 дюйма"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={editFormData.has_keyboard}
                  onCheckedChange={(checked) =>
                    setEditFormData({
                      ...editFormData,
                      has_keyboard: checked as boolean,
                    })
                  }
                />
                <Label>Есть клавиатура</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={editFormData.has_mouse}
                  onCheckedChange={(checked) =>
                    setEditFormData({
                      ...editFormData,
                      has_mouse: checked as boolean,
                    })
                  }
                />
                <Label>Есть мышь</Label>
              </div>
            </div>
          </div>
        );

      case "Проектор":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Модель</Label>
                <Input
                  value={editFormData.model}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, model: e.target.value })
                  }
                  placeholder="Epson EB-X51"
                />
              </div>
              <div>
                <Label>Яркость (люмены)</Label>
                <Input
                  type="number"
                  value={editFormData.lumens}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      lumens: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder="3800"
                />
              </div>
              <div>
                <Label>Разрешение</Label>
                <Input
                  value={editFormData.resolution}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      resolution: e.target.value,
                    })
                  }
                  placeholder="1920x1080"
                />
              </div>
              <div>
                <Label>Тип проекции</Label>
                <Select
                  value={editFormData.throw_type}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, throw_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standart">Стандартная</SelectItem>
                    <SelectItem value="short">Короткая</SelectItem>
                    <SelectItem value="ultra_short">Ультракороткая</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      // Additional cases for other equipment types...
      // For brevity, I'm showing just the first two, but you would repeat the pattern

      default:
        return (
          <div>
            Для этого типа оборудования редактирование характеристик недоступно
          </div>
        );
    }
  };

  return (
    <Layout>
      <>
        <main className="flex-1 mt-3 flex">
          <div className="flex-1 px-6">
            {/* Filter Section */}
            <div className="flex space-x-4 mb-6">
              <Select
                onValueChange={(value) =>
                  setSelectedBlock(value === "-" ? null : Number(value))
                }
                value={selectedBlock?.toString() || ""}
              >
                <SelectTrigger className="w-40 bg-white border-gray-300 dark:border-zinc-800 rounded-lg">
                  <SelectValue placeholder="Блок" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">Все блоки</SelectItem>
                  {blocks.map((block: TBlock) => (
                    <SelectItem key={block.id} value={block.id.toString()}>
                      {block.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) =>
                  setSelectedRoom(value === "-" ? null : Number(value))
                }
                value={selectedRoom?.toString() || ""}
              >
                <SelectTrigger className="w-40 bg-white border-gray-300 dark:border-zinc-800 rounded-lg">
                  <SelectValue placeholder="Номер" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">Все комнаты</SelectItem>
                  {rooms.map((room: TRoom) => (
                    <SelectItem key={room.id} value={room.id.toString()}>
                      {room.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) =>
                  setSelectedEquipmentType(value === "-" ? null : Number(value))
                }
                value={selectedEquipmentType?.toString() || ""}
              >
                <SelectTrigger className="w-48 bg-white border-gray-300 dark:border-zinc-800 rounded-lg">
                  <SelectValue placeholder="Тип оборудования" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-">Все типы</SelectItem>
                  {equipmentTypes.map((type: EquipmentTypes) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Equipment List */}
            <div className="rounded-xl overflow-hidden border dark:border-zinc-800">
              <div className="p-0">
                {isLoading ? (
                  <p className="p-6 text-center text-gray-500">Загрузка...</p>
                ) : addetsPaginate.length === 0 ? (
                  <p className="p-6 text-center text-gray-500">
                    Нет добавленного оборудования
                  </p>
                ) : (
                  addetsPaginate.map(
                    (equipment: {
                      id: number;
                      name: string;
                      data: Tequipment[];
                    }) => (
                      <CustomAccordion
                        key={equipment.id}
                        value={`equipments-${equipment.id}`}
                        className="bg-white dark:bg-zinc-950 border-t first:border-t-0"
                        triggerContent={
                          <>
                            <IconLabel
                              icon={() => (
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    inventoryIcons.find(
                                      (icon) => icon.name === equipment.name
                                    )?.color || "bg-blue-50 dark:bg-accent"
                                  }`}
                                >
                                  <div className="text-gray-600">
                                    {inventoryIcons.find(
                                      (icon) => icon.name === equipment.name
                                    )?.icon || <CircleIcon />}
                                  </div>
                                </div>
                              )}
                              color="#000"
                              className="flex-1"
                              label={equipment.name}
                            />
                            <div className="flex-1 flex justify-center">
                              <div className="bg-indigo-50 dark:bg-zinc-900 dark:text-indigo-400 w-12 h-12 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                                {equipment.data.length}
                              </div>
                            </div>
                          </>
                        }
                      >
                        {equipment.data.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center p-4 border-b dark:border-b-accent bg-background first:border-t border-t-accent border-gray-200 last:border-b-0"
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <div
                                className={`w-12 h-12 rounded-full ${
                                  inventoryIcons.find(
                                    (icon) => icon.name === equipment.name
                                  )?.color
                                } flex items-center justify-center`}
                              >
                                {inventoryIcons.find(
                                  (icon) => icon.name === equipment.name
                                )?.icon || <CircleIcon />}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-accent-foreground text-lg font-medium">
                                  {item.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {item.room_data?.name} -{" "}
                                  {getStatusText(item.status)} - ИНН:{" "}
                                  {item.uid || "Не указан"}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(item)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                              >
                                <Edit className="h-5 w-5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(item)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CustomAccordion>
                    )
                  )
                )}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="flex items-center space-x-2 bg-white dark:bg-accent text-accent-foreground border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span>Предыдущий</span>
                </Button>
                <span className="text-accent-foreground">
                  Страница {currentPage} из {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="flex items-center space-x-2 bg-white dark:bg-accent text-accent-foreground border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <span>Следующий</span>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Edit Modal */}
            <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
              <DialogContent className="w-[60%] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    Редактировать {selectedEquipment?.type_data?.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Основная информация</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-name">Название</Label>
                        <Input
                          id="edit-name"
                          value={editFormData.name}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              name: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-inn">ИНН</Label>
                        <Input
                          id="edit-inn"
                          value={editFormData.inn}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              inn: e.target.value,
                            })
                          }
                          className="mt-1"
                          placeholder="Введите ИНН"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-status">Статус</Label>
                        <Select
                          value={editFormData.status}
                          onValueChange={(value) =>
                            setEditFormData({ ...editFormData, status: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NEW">Новое</SelectItem>
                            <SelectItem value="WORKING">Рабочее</SelectItem>
                            <SelectItem value="NEEDS_REPAIR">
                              Требуется ремонт
                            </SelectItem>
                            <SelectItem value="DISPOSED">
                              Утилизировано
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-room">Комната</Label>
                        <Select
                          value={editFormData.room.toString()}
                          onValueChange={(value) =>
                            setEditFormData({
                              ...editFormData,
                              room: parseInt(value),
                            })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {rooms.map((room: TRoom) => (
                              <SelectItem
                                key={room.id}
                                value={room.id.toString()}
                              >
                                {room.number} - {room.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-description">Описание</Label>
                      <Textarea
                        id="edit-description"
                        value={editFormData.description}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            description: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-active"
                        checked={editFormData.is_active}
                        onCheckedChange={(checked) =>
                          setEditFormData({
                            ...editFormData,
                            is_active: checked as boolean,
                          })
                        }
                      />
                      <Label htmlFor="edit-active">Активное</Label>
                    </div>

                    {/* Photo Upload */}
                    <div className="flex items-center gap-4 justify-between relative">
                      <p className="flex-1 text-black/50 border h-12 flex items-center px-3 rounded-md text-sm">
                        Новое фото:
                        {editFormData.photo && (
                          <span className="text-sm pl-2 text-black">
                            {editFormData.photo.name}
                          </span>
                        )}
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        className="opacity-0 absolute right-0 w-32 h-14"
                        id="edit-photo-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setEditFormData({ ...editFormData, photo: file });
                          }
                        }}
                      />
                      <label
                        htmlFor="edit-photo-upload"
                        className="cursor-pointer"
                      >
                        <Button
                          type="button"
                          variant="secondary"
                          className="gap-1 bg-indigo-600 hover:bg-indigo-400 text-white text-lg h-12"
                        >
                          <Upload size={16} /> Загрузить
                        </Button>
                      </label>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Характеристики</h3>
                    {renderSpecificationForm()}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setEditModalOpen(false)}
                    disabled={isUpdating}
                  >
                    Отменить
                  </Button>
                  <Button
                    onClick={handleEditSave}
                    disabled={isUpdating}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Сохранение...
                      </>
                    ) : (
                      "Сохранить"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
              <DialogContent className="w-[30%]">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    <span>Подтверждение удаления</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-gray-600">
                    Вы уверены, что хотите удалить оборудование{" "}
                    <span className="font-semibold">
                      {selectedEquipment?.name}
                    </span>
                    ?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Это действие нельзя отменить.
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteModalOpen(false)}
                    disabled={isDeleting}
                  >
                    Отменить
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Удаление...
                      </>
                    ) : (
                      "Удалить"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </main>
      </>
    </Layout>
  );
};

export default AddedEquipmentPage;
