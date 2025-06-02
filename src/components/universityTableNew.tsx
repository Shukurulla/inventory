import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomAccordion from "./CustomAccordion";
import { Plus, ChevronRight, Edit, Trash2 } from "lucide-react";
import HomeIcon from "@/assets/Icons/HomeIcon";
import FacultyIcon from "@/assets/Icons/Faculty";
import RoomIcon from "@/assets/Icons/RoomIcon";
import ShieldIcon from "@/assets/Icons/Shield";
import DesktopIcon from "@/assets/Icons/DesktopIcon";
import MonoblockIcon from "@/assets/Icons/MonoblockIcon";
import ElectronBoardIcon from "@/assets/Icons/EelctronBoardIcon";
import TvIcon from "@/assets/Icons/TvIcon";
import MonitorIcon from "@/assets/Icons/MonitorIocn";
import LaptopIcon from "@/assets/Icons/LaptopIcon";
import PrinterIcon from "@/assets/Icons/PrinterIcon";
import RouterIcon from "@/assets/Icons/RouterIcon";
import GogglesIcon from "@/assets/Icons/GogglesIcon";
import { InventoryModal } from "./InventoryModal";
import IconLabel from "./ReusableIcon";
import AccordionSkeleton from "./Skeletons/AccordionSkeleton";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { setSelected } from "@/store/universitySlice";
import type { TEquipmnetTypesRoom, Tequipment } from "@/types";
import { universityApi } from "@/api/universityApiAxios";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "react-toastify";
import { errorValidatingWithToast } from "@/utils/ErrorValidation";
import { CircleIcon } from "lucide-react";
import type { JSX } from "react";
import { EQUIPMENT_TYPES } from "@/types";

interface EquipmentIcons {
  icon: JSX.Element;
  name: string;
  color: string;
}

interface AccordionProps {
  value: string;
  triggerContent: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isOpen?: boolean;
}

const AccordionWrapper = ({
  value,
  triggerContent,
  children,
  className,
  onClick,
  isOpen,
}: AccordionProps) => (
  <CustomAccordion
    value={isOpen ? value : ""}
    className={`border-t border-zinc-200 dark:border-accent text-accent-foreground bg-white dark:bg-zinc-900 ${
      className || ""
    }`}
    onClick={onClick}
    triggerContent={triggerContent}
  >
    {children}
  </CustomAccordion>
);

export function UniversityTable() {
  const dispatch = useDispatch();
  const { selectedBlockId, selectedFloorId, selectedRoomId } = useSelector(
    (state: RootState) => state.university
  );

  // Accordion ochiq/yopiq holatini boshqarish uchun
  const [openAccordions, setOpenAccordions] = useState<{
    block?: number;
    floor?: number;
    faculty?: number;
    room?: number;
  }>({});

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Tequipment | null>(
    null
  );
  const [selectedEquipmentType, setSelectedEquipmentType] =
    useState<TEquipmnetTypesRoom | null>(null);

  // Edit form data
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    status: "",
    is_active: false,
  });

  // React Query with refetchOnMount for real-time updates
  const {
    data: blocks = [],
    isLoading: blocksIsLoading,
    refetch: refetchBlocks,
  } = useQuery({
    queryKey: ["blocks", 1],
    queryFn: () => universityApi.getBlocks(1),
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const { data: floors = [], isLoading: floorsIsLoading } = useQuery({
    queryKey: ["floors"],
    queryFn: universityApi.getFloors,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const { data: faculties = [], isLoading: facultiesIsLoading } = useQuery({
    queryKey: ["faculties", selectedBlockId, selectedFloorId],
    queryFn: () =>
      universityApi.getFaculties({
        buildingId: selectedBlockId!,
        floorId: selectedFloorId!,
      }),
    enabled: !!selectedBlockId && !!selectedFloorId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const { data: rooms = [], isLoading: roomsIsLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: universityApi.getRooms,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const {
    data: equipmentsTypesRoom = [],
    isLoading: equipmentsIsLoading,
    refetch: refetchEquipments,
  } = useQuery({
    queryKey: ["equipmentsTypesRoom", selectedRoomId],
    queryFn: () => universityApi.getEquipmentsTypesRoom(selectedRoomId!),
    enabled: !!selectedRoomId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    // Polling every 10 seconds when modal is not open
    refetchInterval: showModal ? false : 10000,
  });

  const handleSelect = (
    type: "block" | "floor" | "faculty" | "room",
    id: number | null
  ) => {
    if (type === "block") {
      dispatch(setSelected({ type: "block", id }));
      dispatch(setSelected({ type: "floor", id: null }));
      dispatch(setSelected({ type: "room", id: null }));
      // Faqat tanlangan blokni ochiq qoldirish
      setOpenAccordions({ block: id || undefined });
    } else if (type === "floor") {
      dispatch(setSelected({ type: "floor", id }));
      dispatch(setSelected({ type: "room", id: null }));
      // Block va Floor ochiq qoldirish
      setOpenAccordions({
        block: selectedBlockId || undefined,
        floor: id || undefined,
      });
    } else if (type === "faculty") {
      // Faculty tanlanganda navigatsiyani yangilash
      setOpenAccordions({
        block: selectedBlockId || undefined,
        floor: selectedFloorId || undefined,
        faculty: id || undefined,
      });
    } else if (type === "room") {
      dispatch(setSelected({ type: "room", id }));
      // Barcha kerakli levellarni ochiq qoldirish
      setOpenAccordions({
        block: selectedBlockId || undefined,
        floor: selectedFloorId || undefined,
        faculty: openAccordions.faculty,
        room: id || undefined,
      });
    }
  };

  // Handle modal close and refetch data
  const handleModalClose = (open: boolean) => {
    setShowModal(open);
    if (!open) {
      // Refetch data when modal closes to show new equipment
      console.log("Modal closed, refetching equipment data...");
      refetchEquipments();

      // Also refetch blocks and rooms to get updated counts
      setTimeout(() => {
        refetchBlocks();
      }, 1000);
    }
  };

  // Get current selections for breadcrumb
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const selectedFloor = floors.find((f) => f.id === selectedFloorId);
  const selectedFaculty = faculties.find(
    (f) => f.id === openAccordions.faculty
  );
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  const inventoryIcons: EquipmentIcons[] = [
    {
      icon: (
        <DesktopIcon
          color="#5CB8D1"
          className="bg-[#DAF1FB] dark:bg-blue-300/30 rounded-full dark:brightness-70"
        />
      ),
      name: "Компьютер",
      color: "bg-[#DAF1FB] dark:bg-blue-300/30",
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

  const handleEquipmentEdit = (equipment: Tequipment) => {
    setSelectedEquipment(equipment);
    setEditFormData({
      name: equipment.name,
      description: equipment.description,
      status: equipment.status,
      is_active: equipment.is_active,
    });
    setShowEditModal(true);
  };

  const handleEquipmentDelete = (equipment: Tequipment) => {
    setSelectedEquipment(equipment);
    setShowDeleteModal(true);
  };

  const handleEditSave = async () => {
    if (!selectedEquipment) return;

    try {
      // API call to update equipment
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://invenmaster.pythonanywhere.com/inventory/equipment/${selectedEquipment.id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editFormData.name,
            description: editFormData.description,
            status: editFormData.status,
            is_active: editFormData.is_active,
          }),
        }
      );

      if (response.ok) {
        toast.success("Оборудование успешно обновлено!");
        setShowEditModal(false);
        // Refetch equipment data
        refetchEquipments();
      } else {
        throw new Error("Failed to update equipment");
      }
    } catch (error) {
      console.error("Failed to update equipment:", error);
      errorValidatingWithToast(error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEquipment) return;

    try {
      // API call to delete equipment
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `https://invenmaster.pythonanywhere.com/inventory/equipment/bulk-delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: [selectedEquipment.id],
          }),
        }
      );

      if (response.ok) {
        toast.success("Оборудование успешно удалено!");
        setShowDeleteModal(false);
        // Refetch equipment data
        refetchEquipments();
      } else {
        throw new Error("Failed to delete equipment");
      }
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

  // Inventor qo'shish tugmasi komponenti
  const AddInventoryButton = ({
    level,
    onClick,
    className = "",
  }: {
    level: string;
    onClick: () => void;
    className?: string;
  }) => (
    <div
      className={`p-4 border-t border-gray-100 dark:border-gray-700 ${className}`}
    >
      <Button
        variant="outline"
        size="sm"
        className="w-full flex items-center justify-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
        onClick={onClick}
      >
        <Plus className="h-4 w-4" />
        Добавить инвентарь в {level}
      </Button>
    </div>
  );

  const renderEquipmentTypeRow = (equipmentType: TEquipmnetTypesRoom) => {
    const matchedIcon = inventoryIcons.find(
      (icon) => icon.name === equipmentType.name
    );

    return (
      <div
        key={equipmentType.name}
        className="border-t ml-3 bg-white dark:bg-zinc-900 first:border-t-0"
      >
        <div className="flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
          <div className="flex items-center gap-4 flex-1">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                matchedIcon?.color || "bg-blue-50 dark:bg-accent"
              }`}
            >
              <div className="text-gray-600">
                {matchedIcon?.icon || <CircleIcon />}
              </div>
            </div>
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {equipmentType.name}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="bg-indigo-50 dark:bg-zinc-800 dark:text-indigo-400 px-3 py-1 rounded-full text-indigo-600 font-medium">
              {equipmentType.length || 0}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/50"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Adding equipment to room:", selectedRoomId);
                if (selectedRoomId) {
                  setSelectedEquipmentType(equipmentType);
                  setShowModal(true);
                }
              }}
            >
              <Plus className="h-5 w-5 text-blue-500" />
            </Button>
          </div>
        </div>

        {/* Equipment Items */}
        {equipmentType.items && equipmentType.items.length > 0 && (
          <div className="pl-8 pr-4 pb-4">
            {equipmentType.items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-zinc-800 rounded-lg mb-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-300">
                      {equipmentType.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.name}
                    </span>
                    <div className="text-xs text-gray-500">
                      {getStatusText(item.status)}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEquipmentEdit(item);
                    }}
                    className="h-6 w-6 text-blue-500 hover:bg-blue-100"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEquipmentDelete(item);
                    }}
                    className="h-6 w-6 text-red-500 hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {equipmentType.items.length > 3 && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  className="text-xs text-gray-500"
                  onClick={() => {
                    setSelectedEquipmentType(equipmentType);
                    setShowModal(true);
                  }}
                >
                  Показать ещё {equipmentType.items.length - 3} элементов...
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-5">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Навигация:</span>
          {selectedBlock && (
            <>
              <ChevronRight className="w-4 h-4" />
              <button
                onClick={() => handleSelect("block", selectedBlock.id)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {selectedBlock.name}
              </button>
            </>
          )}
          {selectedFloor && (
            <>
              <ChevronRight className="w-4 h-4" />
              <button
                onClick={() => handleSelect("floor", selectedFloor.id)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {selectedFloor.number}-этаж
              </button>
            </>
          )}
          {selectedFaculty && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-indigo-600 font-medium">
                {selectedFaculty.name}
              </span>
            </>
          )}
          {selectedRoom && (
            <>
              <ChevronRight className="w-4 h-4" />
              <span className="text-indigo-600 font-medium">
                {selectedRoom.number}-{selectedRoom.name}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="border border-zinc-200 dark:border-accent bg-[#D8DCFD5C] rounded-lg overflow-x-hidden">
        {blocksIsLoading && <AccordionSkeleton />}
        {!blocksIsLoading && blocks.length === 0 && (
          <p className="ml-3 text-gray-500 p-4">Пустая строка...</p>
        )}
        {!blocksIsLoading &&
          blocks.map((block) => {
            const filteredFloors = floors.filter(
              (floor) => floor.building === block.id
            );
            const isBlockOpen = openAccordions.block === block.id;

            return (
              <AccordionWrapper
                key={block.id}
                value={`block-${block.id}`}
                className="first:border-t-0"
                onClick={() => handleSelect("block", block.id)}
                isOpen={isBlockOpen}
                triggerContent={
                  <IconLabel
                    icon={HomeIcon}
                    color="#D9B88C"
                    label={block.name}
                  />
                }
              >
                {floorsIsLoading && <AccordionSkeleton />}
                {!floorsIsLoading && filteredFloors.length === 0 && (
                  <>
                    <p className="ml-3 text-gray-500 p-4">Пустая строка...</p>
                    <AddInventoryButton
                      level="блок"
                      onClick={() => {
                        // Blok uchun inventory qo'shish logikasi
                        console.log("Adding inventory to block:", block.id);
                        if (selectedRoomId) {
                          setShowModal(true);
                        } else {
                          toast.warning("Сначала выберите кабинет");
                        }
                      }}
                      className="ml-3"
                    />
                  </>
                )}
                {!floorsIsLoading &&
                  filteredFloors.map((floor) => {
                    const filteredFaculties = faculties.filter(
                      (faculty) =>
                        faculty.building === block.id &&
                        faculty.floor === floor.id
                    );
                    const isFloorOpen = openAccordions.floor === floor.id;

                    return (
                      <AccordionWrapper
                        key={floor.id}
                        value={`floor-${floor.id}`}
                        className="ml-3"
                        onClick={() => handleSelect("floor", floor.id)}
                        isOpen={isFloorOpen}
                        triggerContent={
                          <IconLabel
                            icon={ShieldIcon}
                            color="#D9B88C"
                            label={`${floor.number}-Этаж`}
                          />
                        }
                      >
                        {facultiesIsLoading && <AccordionSkeleton />}
                        {!facultiesIsLoading &&
                          filteredFaculties.length === 0 && (
                            <>
                              <p className="ml-3 text-gray-500 p-4">
                                Пустая строка...
                              </p>
                              <AddInventoryButton
                                level="этаж"
                                onClick={() => {
                                  console.log(
                                    "Adding inventory to floor:",
                                    floor.id
                                  );
                                  if (selectedRoomId) {
                                    setShowModal(true);
                                  } else {
                                    toast.warning("Сначала выберите кабинет");
                                  }
                                }}
                                className="ml-3"
                              />
                            </>
                          )}
                        {!facultiesIsLoading &&
                          filteredFaculties.map((faculty) => {
                            const facultyRooms = rooms.filter(
                              (room) =>
                                room.building === block.id &&
                                room.floor === floor.id
                            );
                            const isFacultyOpen =
                              openAccordions.faculty === faculty.id;

                            return (
                              <AccordionWrapper
                                key={faculty.id}
                                value={`faculty-${faculty.id}`}
                                className="ml-3"
                                onClick={() =>
                                  handleSelect("faculty", faculty.id)
                                }
                                isOpen={isFacultyOpen}
                                triggerContent={
                                  <IconLabel
                                    icon={FacultyIcon}
                                    color="#D9B88C"
                                    label={faculty.name}
                                  />
                                }
                              >
                                {roomsIsLoading && <AccordionSkeleton />}
                                {!roomsIsLoading &&
                                  facultyRooms.length === 0 && (
                                    <>
                                      <p className="ml-3 text-gray-500 p-4">
                                        Пустая строка...
                                      </p>
                                      <AddInventoryButton
                                        level="факультет"
                                        onClick={() => {
                                          console.log(
                                            "Adding inventory to faculty:",
                                            faculty.id
                                          );
                                          if (selectedRoomId) {
                                            setShowModal(true);
                                          } else {
                                            toast.warning(
                                              "Сначала выберите кабинет"
                                            );
                                          }
                                        }}
                                        className="ml-3"
                                      />
                                    </>
                                  )}
                                {!roomsIsLoading &&
                                  facultyRooms.map((room) => {
                                    const isRoomOpen =
                                      openAccordions.room === room.id;

                                    return (
                                      <AccordionWrapper
                                        key={room.id}
                                        value={`room-${room.id}`}
                                        className="ml-3"
                                        onClick={() =>
                                          handleSelect("room", room.id)
                                        }
                                        isOpen={isRoomOpen}
                                        triggerContent={
                                          <IconLabel
                                            icon={RoomIcon}
                                            color="#D9B88C"
                                            label={`${room.number}-${room.name}`}
                                          />
                                        }
                                      >
                                        {equipmentsIsLoading && (
                                          <AccordionSkeleton />
                                        )}

                                        {!equipmentsIsLoading &&
                                          equipmentsTypesRoom.map((equipment) =>
                                            renderEquipmentTypeRow(equipment)
                                          )}

                                        {/* Always show add button if room is selected */}
                                        {selectedRoomId === room.id &&
                                          !equipmentsIsLoading && (
                                            <div className="p-4 border-t border-gray-100 dark:border-gray-700 ml-3">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full flex items-center justify-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  console.log(
                                                    "Adding equipment to selected room:",
                                                    room.id
                                                  );
                                                  setShowModal(true);
                                                }}
                                              >
                                                <Plus className="h-4 w-4" />
                                                Добавить новую технику
                                              </Button>
                                            </div>
                                          )}
                                      </AccordionWrapper>
                                    );
                                  })}
                              </AccordionWrapper>
                            );
                          })}
                      </AccordionWrapper>
                    );
                  })}
              </AccordionWrapper>
            );
          })}
      </div>

      {/* Modals */}
      <InventoryModal
        open={showModal}
        roomId={selectedRoomId}
        onOpenChange={handleModalClose}
      />

      {/* Edit Equipment Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
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
                  setEditFormData({ ...editFormData, name: e.target.value })
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
                  <SelectItem value="NEEDS_REPAIR">Требуется ремонт</SelectItem>
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
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
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

      {/* Delete Equipment Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="w-[30%]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Trash2 className="h-6 w-6 text-red-500" />
              <span>Подтверждение удаления</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Вы уверены, что хотите удалить оборудование{" "}
              <span className="font-semibold">{selectedEquipment?.name}</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Это действие нельзя отменить.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
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
}
