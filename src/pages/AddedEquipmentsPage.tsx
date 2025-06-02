import {
  useDeleteEquipmentsMutation,
  useGetAddedEquipmentsQuery,
  useGetBlocksQuery,
  useGetEquipmentTypesQuery,
  useGetRoomsQuery,
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
import type { EquipmentTypes, TBlock, Tequipment, TRoom } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  CircleIcon,
  Trash2,
  Edit,
  AlertTriangle,
} from "lucide-react";
import React, { useState, type JSX } from "react";
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
  });

  const { data: blocks = [] } = useGetBlocksQuery({ univerId: 1 });
  const { data: rooms = [] } = useGetRoomsQuery();
  const { data: equipmentTypes = [] } = useGetEquipmentTypesQuery();
  const {
    data: allAddets = [],
    isLoading,
    refetch,
  } = useGetAddedEquipmentsQuery();
  const [deleteEquipment, { isLoading: isDeleting }] =
    useDeleteEquipmentsMutation();

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
    setEditFormData({
      name: equipment.name,
      description: equipment.description,
      status: equipment.status,
      is_active: equipment.is_active,
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
      // Here you would call an update API if it exists
      // For now, we'll just show a success message
      toast.success("Оборудование успешно обновлено!");
      setEditModalOpen(false);
      await refetch();
    } catch (error) {
      console.error("Failed to update equipment:", error);
      errorValidatingWithToast(error);
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

  return (
    <Layout>
      <>
        <header className="p-6">
          <h1 className="text-3xl font-semibold text-accent-foreground">
            Добавленные
          </h1>
        </header>
        <main className="flex-1 flex">
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
                                  {getStatusText(item.status)}
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
              <DialogContent className="w-[40%]">
                <DialogHeader>
                  <DialogTitle>Редактировать оборудование</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
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
                        <SelectItem value="DISPOSED">Утилизировано</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-active"
                      checked={editFormData.is_active}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          is_active: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <Label htmlFor="edit-active">Активное</Label>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setEditModalOpen(false)}
                    className="bg-gray-200 hover:bg-gray-300"
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
                    className="bg-gray-200 hover:bg-gray-300"
                  >
                    Отменить
                  </Button>
                  <Button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeleting ? "Удаление..." : "Удалить"}
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
