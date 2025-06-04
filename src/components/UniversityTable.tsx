"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronRight, ChevronDown, Plus } from "lucide-react"
import HomeIcon from "@/assets/Icons/HomeIcon"
import FacultyIcon from "@/assets/Icons/Faculty"
import RoomIcon from "@/assets/Icons/RoomIcon"
import ShieldIcon from "@/assets/Icons/Shield"
import DesktopIcon from "@/assets/Icons/DesktopIcon"
import MonoblockIcon from "@/assets/Icons/MonoblockIcon"
import PrinterIcon from "@/assets/Icons/PrinterIcon"
import { universityApi } from "@/api/universityApiAxios"
import { Button } from "./ui/button"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { setSelected } from "@/store/universitySlice"

interface UniversityTableProps {
  onCreateInventory?: (roomId: number) => void
}

export function UniversityTable({ onCreateInventory }: UniversityTableProps) {
  const dispatch = useDispatch()
  const { selectedBlockId, selectedFloorId, selectedRoomId } = useSelector((state: RootState) => state.university)

  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const { data: blocks = [] } = useQuery({
    queryKey: ["blocks", 1],
    queryFn: () => universityApi.getBlocks(1),
    refetchOnMount: "always",
  })

  const { data: floors = [] } = useQuery({
    queryKey: ["floors"],
    queryFn: universityApi.getFloors,
    refetchOnMount: "always",
  })

  const { data: faculties = [] } = useQuery({
    queryKey: ["faculties", selectedBlockId, selectedFloorId],
    queryFn: () =>
      universityApi.getFaculties({
        buildingId: selectedBlockId!,
        floorId: selectedFloorId!,
      }),
    enabled: !!selectedBlockId && !!selectedFloorId,
    refetchOnMount: "always",
  })

  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: universityApi.getRooms,
    refetchOnMount: "always",
  })

  const { data: equipmentsTypesRoom = [] } = useQuery({
    queryKey: ["equipmentsTypesRoom", selectedRoomId],
    queryFn: () => universityApi.getEquipmentsTypesRoom(selectedRoomId!),
    enabled: !!selectedRoomId,
    refetchOnMount: "always",
    refetchInterval: 10000,
  })

  const toggleOpen = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const handleSelect = (type: "block" | "floor" | "faculty" | "room", id: number | null) => {
    if (type === "block") {
      dispatch(setSelected({ type: "block", id }))
      dispatch(setSelected({ type: "floor", id: null }))
      dispatch(setSelected({ type: "room", id: null }))
    } else if (type === "floor") {
      dispatch(setSelected({ type: "floor", id }))
      dispatch(setSelected({ type: "room", id: null }))
    } else if (type === "room") {
      dispatch(setSelected({ type: "room", id }))
    }
  }

  const getEquipmentIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "компьютер":
        return <DesktopIcon />
      case "моноблок":
        return <MonoblockIcon />
      case "принтер":
        return <PrinterIcon />
      default:
        return <RoomIcon />
    }
  }

  // Equipment ordering
  const equipmentOrder = [
    "Компьютер",
    "Моноблок",
    "Принтер",
    "Проектор",
    "Электронная доска",
    "Телевизор",
    "Ноутбук",
    "Роутер",
    "Монитор",
    "Удлинитель",
  ]

  const sortedEquipments = [...equipmentsTypesRoom].sort((a, b) => {
    const aIndex = equipmentOrder.indexOf(a.name)
    const bIndex = equipmentOrder.indexOf(b.name)
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
  })

  const FolderItem = ({
    id,
    icon,
    label,
    children,
    level = 0,
    onClick,
    rightElement,
  }: {
    id: string
    icon: React.ReactNode
    label: string
    children?: React.ReactNode
    level?: number
    onClick?: () => void
    rightElement?: React.ReactNode
  }) => {
    const isOpen = openItems.has(id)
    const hasChildren = !!children

    return (
      <div className="bg-white border-b border-gray-100">
        <div
          className={`flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors`}
          style={{ paddingLeft: `${12 + level * 24}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleOpen(id)
            }
            onClick?.()
          }}
        >
          <div className="flex items-center gap-3">
            {hasChildren && (
              <div className="w-4 h-4 flex items-center justify-center">
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                )}
              </div>
            )}
            {!hasChildren && <div className="w-4" />}
            <div className="w-8 h-8 flex items-center justify-center">{icon}</div>
            <span className="font-medium text-gray-900">{label}</span>
          </div>
          {rightElement}
        </div>
        {isOpen && children && <div className="bg-gray-50">{children}</div>}
      </div>
    )
  }

  return (
    <div className="py-5">
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {blocks.map((block) => {
          const filteredFloors = floors.filter((floor) => floor.building === block.id)

          return (
            <FolderItem
              key={block.id}
              id={`block-${block.id}`}
              icon={<HomeIcon />}
              label={block.name}
              onClick={() => handleSelect("block", block.id)}
            >
              {filteredFloors.map((floor) => {
                const filteredFaculties = faculties.filter(
                  (faculty) => faculty.building === block.id && faculty.floor === floor.id,
                )

                return (
                  <FolderItem
                    key={floor.id}
                    id={`floor-${floor.id}`}
                    icon={<ShieldIcon />}
                    label={`${floor.number}-Этаж`}
                    level={1}
                    onClick={() => handleSelect("floor", floor.id)}
                  >
                    {filteredFaculties.map((faculty) => {
                      const facultyRooms = rooms.filter((room) => room.building === block.id && room.floor === floor.id)

                      return (
                        <FolderItem
                          key={faculty.id}
                          id={`faculty-${faculty.id}`}
                          icon={<FacultyIcon />}
                          label={faculty.name}
                          level={2}
                        >
                          {facultyRooms.map((room) => (
                            <FolderItem
                              key={room.id}
                              id={`room-${room.id}`}
                              icon={<RoomIcon />}
                              label={`${room.number}-${room.name}`}
                              level={3}
                              onClick={() => handleSelect("room", room.id)}
                              rightElement={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onCreateInventory?.(room.id)
                                  }}
                                  className="h-8 w-8 rounded-full bg-blue-50 hover:bg-blue-100"
                                >
                                  <Plus className="h-4 w-4 text-blue-500" />
                                </Button>
                              }
                            >
                              {sortedEquipments.map((equipment) => (
                                <FolderItem
                                  key={equipment.name}
                                  id={`equipment-${equipment.name}-${room.id}`}
                                  icon={getEquipmentIcon(equipment.name)}
                                  label={`${equipment.name} (${equipment.items?.length || 0})`}
                                  level={4}
                                >
                                  {equipment.items?.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex justify-between items-center p-3 bg-white border-b border-gray-100"
                                      style={{ paddingLeft: `${12 + 5 * 24}px` }}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                                          <span className="text-xs font-medium text-blue-600">
                                            {equipment.name.charAt(0)}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="font-medium">{item.name}</span>
                                          <div className="text-sm text-gray-500">
                                            ИНН: {item.inn || `ИНН-${item.id.toString().padStart(9, "0")}`}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </FolderItem>
                              ))}
                            </FolderItem>
                          ))}
                        </FolderItem>
                      )
                    })}
                  </FolderItem>
                )
              })}
            </FolderItem>
          )
        })}
      </div>
    </div>
  )
}
