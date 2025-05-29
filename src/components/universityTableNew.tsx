import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CustomAccordion from './CustomAccordion';
import ShieldIcon from '@/assets/Icons/Shield';
import { Plus } from 'lucide-react';
import HomeIcon from '@/assets/Icons/HomeIcon';
import FacultyIcon from '@/assets/Icons/Faculty';
import RoomIcon from '@/assets/Icons/RoomIcon';
import { InventoryModal } from './InventoryModal';
import IconLabel from './ReusableIcon';
import EquipmentRow from './EquipmentRow';
import AccordionSkeleton from './Skeletons/AccordionSkeleton';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import TrashIcon from '@/assets/Icons/TrashIcon';
import MoveIcon from '@/assets/Icons/MoveIcon';
import { setSelected } from '@/store/universitySlice';
import type { TEquipmnetTypesRoom } from '@/types';
import { universityApi } from '@/api/universityApiAxios';
import MoveInventoryModal from './MoveInventoryModal';
import DeleteInventoryModal from './DeleteEquipmentsModal';

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
    className={`border-t border-zinc-200 dark:border-accent text-accent-foreground bg-white dark:bg-zinc-900 ${className || ''}`}
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
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<TEquipmnetTypesRoom | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  const { data: blocks = [], isLoading: blocksIsLoading } = useQuery({
    queryKey: ['blocks', 1],
    queryFn: () => universityApi.getBlocks(1),
  });

  const { data: floors = [], isLoading: floorsIsLoading } = useQuery({
    queryKey: ['floors'],
    queryFn: universityApi.getFloors,
  });

  const { data: faculties = [], isLoading: facultiesIsLoading } = useQuery({
    queryKey: ['faculties', selectedBlockId, selectedFloorId],
    queryFn: () => universityApi.getFaculties({ buildingId: selectedBlockId!, floorId: selectedFloorId! }),
    enabled: !!selectedBlockId && !!selectedFloorId,
  });

  const { data: rooms = [], isLoading: roomsIsLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: universityApi.getRooms,
  });

  const { data: equipmentsTypesRoom = [], isLoading: equipmentsIsLoading } = useQuery({
    queryKey: ['equipmentsTypesRoom', selectedRoomId],
    queryFn: () => universityApi.getEquipmentsTypesRoom(selectedRoomId!),
    enabled: !!selectedRoomId
  });

  const handleSelect = (type: 'block' | 'floor' | 'room', id: number | null) => {
    dispatch(setSelected({ type, id }));
  };

  const handleMoveClick = (equipmentType: TEquipmnetTypesRoom) => {
    setSelectedEquipmentType(equipmentType);
    setShowMoveModal(true);
  };
  const handleDeleteClick = (equipmentType: TEquipmnetTypesRoom) => {
    setSelectedEquipmentType(equipmentType);
    setShowDeleteModal(true);
  }
  
  const renderEquipmentRow = (equipmentType: TEquipmnetTypesRoom) => {
    return (
      <AccordionWrapper
        key={equipmentType.name}
        value={`equipment-${equipmentType.name}`}
        className="ml-3"
        triggerContent={
          <div className="flex items-center justify-between w-full pr-4">
            <IconLabel icon={RoomIcon} color="#D9B88C" label={equipmentType.name} />
            <div className="flex flex-1 items-center justify-center pl-7">
              <p className="text-md bg-gray-100 p-3 py-1 rounded-full">{equipmentType.items?.length || 0}</p>
            </div>
            <div className="flex items-center space-x-3">
              <TrashIcon width={25} onClick={()=> handleDeleteClick(equipmentType)}/>
              <MoveIcon onClick={() => handleMoveClick(equipmentType)} />
            </div>
          </div>
        }
      >
        {equipmentType.items?.length ? (
          equipmentType.items.map((item) => <EquipmentRow key={item.id} equipment={item} />)
        ) : (
          <p className="ml-3 text-gray-500">Пустая строка...</p>
        )}
      </AccordionWrapper>
    );
  };

  return (
    <div className="py-5">
      <div className="border border-zinc-200 dark:border-accent bg-[#D8DCFD5C] rounded-lg overflow-x-hidden">
        {blocksIsLoading && <AccordionSkeleton />}
        {!blocksIsLoading && blocks.length === 0 && (
          <p className="ml-3 text-gray-500">Пустая строка...</p>
        )}
        {!blocksIsLoading &&
          blocks.map((block) => {
            const filteredFloors = floors.filter((floor) => floor.building === block.id);
            return (
              <AccordionWrapper
                key={block.id}
                value={`block-${block.id}`}
                className=" first:border-t-0"
                onClick={() => handleSelect('block', block.id)}
                triggerContent={<IconLabel icon={HomeIcon} color="#D9B88C" label={block.name} />}
              >
                {floorsIsLoading && <AccordionSkeleton />}
                {!floorsIsLoading && filteredFloors.length === 0 && (
                  <p className="ml-3 text-gray-500">Пустая строка...</p>
                )}
                {!floorsIsLoading &&
                  filteredFloors.map((floor) => {
                    const filteredRooms = rooms.filter(
                      (room) => room.building === block.id && room.floor === floor.id
                    );
                    return (
                      <AccordionWrapper
                        key={floor.id}
                        value={`floor-${floor.id}`}
                        className="ml-3"
                        onClick={() => handleSelect('floor', floor.id)}
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
                          ) : faculties.length === 0 ? (
                            <p className="ml-3 text-gray-500">Пустая строка...</p>
                          ) : (
                            faculties.map((faculty) => (
                              <CustomAccordion
                                key={faculty.id}
                                value={`faculty-${faculty.id}`}
                                className="ml-3 bg-white dark:bg-zinc-900 border-t"
                                triggerContent={
                                  <IconLabel icon={FacultyIcon} color="#D9B88C" label={faculty.name} />
                                }
                              >
                                <p className="ml-3 text-gray-500">Пустая строка...</p>
                              </CustomAccordion>
                            ))
                          )}
                        </AccordionWrapper>

                        {/* Rooms */}
                        <AccordionWrapper
                          value={`rooms-${floor.id}`}
                          className="ml-3"
                          triggerContent={<IconLabel icon={RoomIcon} color="#D9B88C" label="Кабинеты" />}
                        >
                          {roomsIsLoading && <AccordionSkeleton />}
                          {!roomsIsLoading && filteredRooms.length === 0 && (
                            <p className="ml-3 text-gray-500">Пустая строка...</p>
                          )}
                          {!roomsIsLoading &&
                            filteredRooms.map((room) => (
                              <AccordionWrapper
                                key={room.id}
                                value={`room-${room.id}`}
                                className="ml-3"
                                onClick={() => handleSelect('room', room.id)}
                                triggerContent={
                                  <IconLabel
                                    icon={RoomIcon}
                                    color="#D9B88C"
                                    label={`${room.number}-${room.name}`}
                                  />
                                }
                              >
                                {equipmentsIsLoading && <AccordionSkeleton />}
                                {!equipmentsIsLoading && equipmentsTypesRoom.length === 0 && (
                                  <p className="ml-3 text-gray-500">Пустая строка...</p>
                                )}
                                {!equipmentsIsLoading &&
                                  equipmentsTypesRoom.map((equipment) => renderEquipmentRow(equipment))}
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
                            ))}
                        </AccordionWrapper>
                      </AccordionWrapper>
                    );
                  })}
              </AccordionWrapper>
            );
          })}
      </div>
      {selectedEquipmentType && (
        <>
          <MoveInventoryModal
            equipmentType={selectedEquipmentType}
            rooms={rooms}
            setShowMoveModal={setShowMoveModal}
            showMoveModal={showMoveModal}
          />
          <DeleteInventoryModal
            equipmentType={selectedEquipmentType}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
          />
        </>
      )}
    </div>
  );
}