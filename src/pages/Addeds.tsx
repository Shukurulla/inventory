import {
  useDeleteEquipmentsMutation,
  useGetAddedEquipmentsQuery,
  useGetBlocksQuery,
  useGetEquipmentsQuery,
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
import type { EquipmentTypes, TBlock, Tequipment, TRoom } from "@/types";
import { ChevronLeft, ChevronRight, CircleIcon, Trash2 } from "lucide-react";
import React, { useEffect, useState, type JSX } from "react";
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

interface EquipmentIcons {
  icon: JSX.Element;
  name: string;
  color: string;
}

const Addeds: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<
    number | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: blocks = [] } = useGetBlocksQuery({ univerId: 1 });
  const { data: rooms = [] } = useGetRoomsQuery();
  const { data: equipmentTypes = [] } = useGetEquipmentTypesQuery();

  const { data: equipments = { results: [] }, refetch } =
    useGetEquipmentsQuery();

  const [deleteEquipment] = useDeleteEquipmentsMutation();

  const totalItems = equipments?.results?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { data: allAddets = [], isLoading } = useGetAddedEquipmentsQuery();
  useEffect(() => {
    console.log(allAddets);
  }, []);

  const filterByType = () => {
    const filteredArray: { id: number; name: string; data: Tequipment[] }[] =
      [];

    Object.entries(EQUIPMENT_TYPES).forEach(([id, name]) => {
      const typeId = parseInt(id);
      if (allAddets && allAddets.length > 0) {
        const filteredData = allAddets.filter((item) => item.type === typeId);
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

  const handleDelete = async (id: number) => {
    try {
      await deleteEquipment({ ids: [id] }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to delete equipment:", error);
    }
  };
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

  return (
    <>
      <div className="flex space-x-4 mb-6">
        <Select
          onValueChange={(value) => setSelectedBlock(Number(value) || null)}
          value={selectedBlock?.toString() || ""}
        >
          <SelectTrigger className="w-40 bg-white border-gray-300 dark:border-zinc-800 rounded-lg">
            <SelectValue placeholder="Блок" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-">Блок</SelectItem>
            {blocks.map((block: TBlock) => (
              <SelectItem key={block.id} value={block.id?.toString()}>
                {block.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => setSelectedRoom(Number(value) || null)}
          value={selectedRoom?.toString() || ""}
        >
          <SelectTrigger className="w-40 bg-white border-gray-300 dark:border-zinc-800 rounded-lg">
            <SelectValue placeholder="Номер" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-">Номер</SelectItem>
            {rooms.map((room: TRoom) => (
              <SelectItem key={room.id} value={room?.id?.toString()}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setSelectedEquipmentType(Number(value) || null)
          }
          value={selectedEquipmentType?.toString() || ""}
        >
          <SelectTrigger className="w-48 bg-white border-gray-300 dark:border-zinc-800 rounded-lg">
            <SelectValue placeholder="Тип оборудования" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="-">Тип оборудования</SelectItem>
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
            <p className="p-2">Loading...</p>
          ) : (
            addetsPaginate.map(
              (equipment: { id: number; name: string; data: Tequipment[] }) => (
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
                      <div className="flex-1">
                        <div className="bg-indigo-50 dark:bg-zinc-900 dark:text-indigo-400 w-12 h-12 rounded-full flex items-center justify-center">
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
                      <div className="flex items-center space-x-3">
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
                        <span className="text-accent-foreground text-xl font-medium">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
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
    </>
  );
};

export default Addeds;
