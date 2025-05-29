import { useState } from "react";
import CustomAccordion from "./CustomAccordion";
import ShieldIcon from "@/assets/Icons/Shield";
import { Plus } from "lucide-react";
import HomeIcon from "@/assets/Icons/HomeIcon";
import FacultyIcon from "@/assets/Icons/Faculty";
import RoomIcon from "@/assets/Icons/RoomIcon";
import { InventoryModal } from "./InventoryModal";
import IconLabel from "./ReusableIcon";
import EquipmentRow from "./EquipmentRow";
import AccordionSkeleton from "./Skeletons/AccordionSkeleton";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  useGetBlocksQuery,
  useGetEquipmentsQuery,
  useGetEquipmentsTypesRoomQuery,
  useGetFacultiesQuery,
  useGetFloorsQuery,
  useGetRoomsQuery,
} from "@/api/universityApi";
import TrashIcon from "@/assets/Icons/TrashIcon";
import EditIcon from "@/assets/Icons/EditIcon";
import MoveIcon from "@/assets/Icons/MoveIcon";
import { setSelected } from "@/store/universitySlice";
import type { Tequipment, TEquipmnetTypesRoom } from "@/types";

interface AccordionProps {
  value: string;
  triggerContent: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const AccordionWrapper = ({ value, triggerContent, children, className, onClick }: AccordionProps) => (
  <CustomAccordion
    value={value}
    className={`border-t bg-white ${className || ""}`}
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
  const [showModal, setShowModal] = useState(false);

  const { data: blocks = [], isLoading: blocksIsLoading } = useGetBlocksQuery({ univerId: 1 });
  const { data: floors = [] } = useGetFloorsQuery();
  const { data: faculties = [], isLoading: facultiesIsLoading } = useGetFacultiesQuery(
    { buildingId: selectedBlockId!, floorId: selectedFloorId! },
    { skip: !selectedBlockId || !selectedFloorId }
  );
  const { data: rooms = [] } = useGetRoomsQuery();
  const { data: allEquipments = [] } = useGetEquipmentsQuery();
  const { data: equipmentsTypesRoom = [] } = useGetEquipmentsTypesRoomQuery(
    { roomId: selectedRoomId! },
    { skip: !selectedRoomId }
  );

  const handleSelect = (type: "block" | "floor" | "room", id: number | null) => {
    dispatch(setSelected({ type, id }));
  };

  const renderEquipmentRow = (equipmentType: TEquipmnetTypesRoom, equipments: { results: Tequipment[] }) => {    
    return (
    <AccordionWrapper
      key={equipmentType.name}
      value={`equipment-${equipmentType.name}`}
      className="ml-3"
      triggerContent={
        <div className="flex items-center justify-between w-full pr-4">
          <IconLabel icon={RoomIcon} color="#D9B88C" label={equipmentType.name} />
          <div className="flex flex-1 items-center justify-center pl-7">
            <p className="text-md bg-gray-100 p-3 py-1 rounded-full">{equipments.results.length || 0}</p>
          </div>
          <div className="flex items-center space-x-3">
            <TrashIcon width={25} />
            <EditIcon width={30} />
            <MoveIcon />
          </div>
        </div>
      }
    >
      {equipmentType.items?.length ? equipmentType.items.map((item) => <EquipmentRow key={item.id} equipment={item} />)
       : <AccordionSkeleton/>
      }
    </AccordionWrapper>
  )};

  return (
    <div className="py-5">
      <div className="border bg-[#D8DCFD5C] rounded-lg overflow-x-hidden">
        {blocksIsLoading && <AccordionSkeleton />}
        {!blocksIsLoading && blocks.map((block) => {
          const filteredFloors = floors.filter((floor) => floor.building === block.id);
          return (
            <AccordionWrapper
              key={block.id}
              value={`block-${block.id}`}
              className="border-b"
              onClick={() => handleSelect("block", block.id)}
              triggerContent={<IconLabel icon={HomeIcon} color="#D9B88C" label={block.name} />}
            >
              {filteredFloors.length ? (
                filteredFloors.map((floor) => {
                  const filteredRooms = rooms.filter(
                    (room) => room.building === block.id && room.floor === floor.id
                  );
                  return (
                    <AccordionWrapper
                      key={floor.id}
                      value={`floor-${floor.id}`}
                      className="ml-3"
                      onClick={() => handleSelect("floor", floor.id)}
                      triggerContent={
                        <IconLabel icon={ShieldIcon} color="#D9B88C" label={`${floor.number}-Этаж`} />
                      }
                    >
                      {/* Faculties */}
                      <AccordionWrapper
                        value={`faculties-${floor.id}`}
                        className="ml-3 border-t"
                        triggerContent={<IconLabel icon={FacultyIcon} color="#D9B88C" label="Факультеты" />}
                      >
                        {facultiesIsLoading ? (
                          <AccordionSkeleton />
                        ) : faculties.length ? (
                          faculties.map((faculty) => (
                            <CustomAccordion
                              key={faculty.id}
                              value={`faculty-${faculty.id}`}
                              className="ml-3 bg-white border-t"
                              triggerContent={
                                <IconLabel icon={FacultyIcon} color="#D9B88C" label={faculty.name} />
                              }
                            />
                          ))
                        ) : (
                          <p className="ml-3 text-gray-500">Пустая строка...</p>
                        )}
                      </AccordionWrapper>

                      {/* Rooms */}
                      <AccordionWrapper
                        value={`rooms-${floor.id}`}
                        className="ml-3"
                        triggerContent={<IconLabel icon={RoomIcon} color="#D9B88C" label="Кабинеты" />}
                      >
                        {filteredRooms.length ? (
                          filteredRooms.map((room) => {
                            const equipments = Array.isArray(allEquipments) ? [] : allEquipments.results?.filter(
                              (equipment) => equipment.room === room.id
                            );
                            return (
                              <AccordionWrapper
                                key={room.id}
                                value={`room-${room.id}`}
                                className="ml-3"
                                onClick={() => handleSelect("room", room.id)}
                                triggerContent={
                                  <IconLabel
                                    icon={RoomIcon}
                                    color="#D9B88C"
                                    label={`${room.number}-${room.name}`}
                                  />
                                }
                              >
                                {equipmentsTypesRoom.length ? (
                                  equipmentsTypesRoom.map((equipment) =>
                                      renderEquipmentRow(equipment, { results: equipments })
                                  )
                                ) : (
                                  !equipmentsTypesRoom ? <p className="ml-3 text-gray-500">Пустая строка...</p> : <AccordionSkeleton/>
                                )}
                                <button
                                  className="w-full h-20 ml-3 flex items-center justify-center space-x-3 text-indigo-500 text-xl rounded"
                                  onClick={() => selectedRoomId && setShowModal(true)}
                                >
                                  <Plus /> <span>Добавить новую технику</span>
                                </button>
                                <InventoryModal
                                  open={showModal}
                                  roomId={selectedRoomId}
                                  onOpenChange={setShowModal}
                                />
                              </AccordionWrapper>
                            );
                          })
                        ) : (
                          <p className="ml-3 text-gray-500">Пустая строка...</p>
                        )}
                      </AccordionWrapper>
                    </AccordionWrapper>
                  );
                })
              ) : filteredFloors !== undefined ? (
                <p className="ml-3 text-gray-500">Пустая строка...</p>
              ) : <AccordionSkeleton/>}
            </AccordionWrapper>
          );
        })}
      </div>
    </div>
  );
}