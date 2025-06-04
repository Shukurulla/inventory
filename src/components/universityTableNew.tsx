// src/components/universityTableNew.tsx - + button qo'shilgan
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomAccordion from "./CustomAccordion";
import { ChevronRight, Edit, Trash2, Plus } from "lucide-react";
import HomeIcon from "@/assets/Icons/HomeIcon";
import FacultyIcon from "@/assets/Icons/Faculty";
import RoomIcon from "@/assets/Icons/RoomIcon";
import ShieldIcon from "@/assets/Icons/Shield";
import IconLabel from "./ReusableIcon";
import AccordionSkeleton from "./Skeletons/AccordionSkeleton";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { setSelected } from "@/store/universitySlice";
import type { TEquipmnetTypesRoom } from "@/types";
import { universityApi } from "@/api/universityApiAxios";
import { Button } from "./ui/button";
import { CircleIcon } from "lucide-react";

interface UniversityTableProps {
  onCreateInventory?: (roomId: number) => void;
}

export function UniversityTable({ onCreateInventory }: UniversityTableProps) {
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

  // React Query with refetchOnMount for real-time updates
  const { data: blocks = [], isLoading: blocksIsLoading } = useQuery({
    queryKey: ["blocks", 1],
    queryFn: () => universityApi.getBlocks(1),
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const { data: floors = [] } = useQuery({
    queryKey: ["floors"],
    queryFn: universityApi.getFloors,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const { data: faculties = [] } = useQuery({
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

  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: universityApi.getRooms,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });

  const { data: equipmentsTypesRoom = [] } = useQuery({
    queryKey: ["equipmentsTypesRoom", selectedRoomId],
    queryFn: () => universityApi.getEquipmentsTypesRoom(selectedRoomId!),
    enabled: !!selectedRoomId,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
  });

  const handleSelect = (
    type: "block" | "floor" | "faculty" | "room",
    id: number | null
  ) => {
    if (type === "block") {
      dispatch(setSelected({ type: "block", id }));
      dispatch(setSelected({ type: "floor", id: null }));
      dispatch(setSelected({ type: "room", id: null }));
      setOpenAccordions({ block: id || undefined });
    } else if (type === "floor") {
      dispatch(setSelected({ type: "floor", id }));
      dispatch(setSelected({ type: "room", id: null }));
      setOpenAccordions({
        block: selectedBlockId || undefined,
        floor: id || undefined,
      });
    } else if (type === "faculty") {
      setOpenAccordions({
        block: selectedBlockId || undefined,
        floor: selectedFloorId || undefined,
        faculty: id || undefined,
      });
    } else if (type === "room") {
      dispatch(setSelected({ type: "room", id }));
      setOpenAccordions({
        block: selectedBlockId || undefined,
        floor: selectedFloorId || undefined,
        faculty: openAccordions.faculty,
        room: id || undefined,
      });
    }
  };

  // Get current selections for breadcrumb
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);
  const selectedFloor = floors.find((f) => f.id === selectedFloorId);
  const selectedFaculty = faculties.find(
    (f) => f.id === openAccordions.faculty
  );
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

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

  // Equipment type row
  const renderEquipmentTypeRow = (equipmentType: TEquipmnetTypesRoom) => {
    return (
      <CustomAccordion
        key={equipmentType.name}
        value={`equipments-${equipmentType.name}`}
        className="bg-white border-t first:border-t-0 ml-3"
        triggerContent={
          <div className="flex items-center justify-between w-full pr-4">
            <IconLabel
              icon={() => (
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-50">
                  <div className="text-gray-600">
                    <CircleIcon />
                  </div>
                </div>
              )}
              color="#000"
              className="flex-1"
              label={equipmentType.name}
            />
            <div className="flex-1 flex justify-center">
              <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                {equipmentType.items?.length || 0}
              </div>
            </div>
          </div>
        }
      >
        <div className="bg-indigo-50 p-0">
          {equipmentType.items && equipmentType.items.length > 0 ? (
            equipmentType.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 border-b bg-background first:border-t border-gray-200 last:border-b-0"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-50">
                    <span className="text-sm font-medium text-blue-600">
                      {equipmentType.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-medium">{item.name}</span>
                    <span className="text-sm text-gray-500">
                      {getStatusText(item.status)} - ИНН:{" "}
                      {item.inn || `ИНН-${item.id.toString().padStart(9, "0")}`}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Нет оборудования этого типа
            </div>
          )}
        </div>
      </CustomAccordion>
    );
  };

  return (
    <div className="py-5">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
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

      <div className="border bg-[#D8DCFD5C] rounded-lg overflow-x-hidden">
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
              <CustomAccordion
                key={block.id}
                value={isBlockOpen ? `block-${block.id}` : ""}
                className="first:border-t-0"
                onClick={() => handleSelect("block", block.id)}
                triggerContent={
                  <IconLabel
                    icon={HomeIcon}
                    color="#D9B88C"
                    label={block.name}
                  />
                }
              >
                {filteredFloors.map((floor) => {
                  const filteredFaculties = faculties.filter(
                    (faculty) =>
                      faculty.building === block.id &&
                      faculty.floor === floor.id
                  );
                  const isFloorOpen = openAccordions.floor === floor.id;

                  return (
                    <CustomAccordion
                      key={floor.id}
                      value={isFloorOpen ? `floor-${floor.id}` : ""}
                      className="ml-3"
                      onClick={() => handleSelect("floor", floor.id)}
                      triggerContent={
                        <IconLabel
                          icon={ShieldIcon}
                          color="#D9B88C"
                          label={`${floor.number}-Этаж`}
                        />
                      }
                    >
                      {filteredFaculties.map((faculty) => {
                        const facultyRooms = rooms.filter(
                          (room) =>
                            room.building === block.id &&
                            room.floor === floor.id
                        );
                        const isFacultyOpen =
                          openAccordions.faculty === faculty.id;

                        return (
                          <CustomAccordion
                            key={faculty.id}
                            value={isFacultyOpen ? `faculty-${faculty.id}` : ""}
                            className="ml-3"
                            onClick={() => handleSelect("faculty", faculty.id)}
                            triggerContent={
                              <IconLabel
                                icon={FacultyIcon}
                                color="#D9B88C"
                                label={faculty.name}
                              />
                            }
                          >
                            {facultyRooms.map((room) => {
                              const isRoomOpen =
                                openAccordions.room === room.id;

                              return (
                                <CustomAccordion
                                  key={room.id}
                                  value={isRoomOpen ? `room-${room.id}` : ""}
                                  className="ml-3"
                                  onClick={() => handleSelect("room", room.id)}
                                  triggerContent={
                                    <div className="flex items-center justify-between w-full pr-4">
                                      <IconLabel
                                        icon={RoomIcon}
                                        color="#D9B88C"
                                        label={`${room.number}-${room.name}`}
                                      />
                                      {/* + button qo'shilgan */}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          onCreateInventory?.(room.id);
                                        }}
                                        className="h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100"
                                      >
                                        <Plus className="h-5 w-5 text-blue-500" />
                                      </Button>
                                    </div>
                                  }
                                >
                                  {equipmentsTypesRoom.length > 0 &&
                                    equipmentsTypesRoom.map((equipment) =>
                                      renderEquipmentTypeRow(equipment)
                                    )}

                                  {equipmentsTypesRoom.length === 0 && (
                                    <div className="p-4 text-center text-gray-500 ml-3">
                                      В этой комнате пока нет оборудования
                                    </div>
                                  )}
                                </CustomAccordion>
                              );
                            })}
                          </CustomAccordion>
                        );
                      })}
                    </CustomAccordion>
                  );
                })}
              </CustomAccordion>
            );
          })}
      </div>
    </div>
  );
}
