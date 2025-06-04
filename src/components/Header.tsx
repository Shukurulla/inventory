"use client"

import type React from "react"

// src/components/Header.tsx - INN qidirishda batafsil modal qo'shildi
import { useState } from "react"
import { Input } from "./ui/input"
import { Search, MapPin, Calendar, User, Download } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Badge } from "./badge"
import type { Tequipment } from "@/types"
import { Button } from "./ui/button"

interface HeaderProps {
  title: string
  children?: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({ title, children }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Tequipment[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Detailed view modal states
  const [selectedEquipment, setSelectedEquipment] = useState<Tequipment | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`https://invenmaster.pythonanywhere.com/inventory/equipment/?search=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.results || [])
        setIsSearchOpen(true)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  const handleEquipmentClick = (equipment: Tequipment) => {
    setSelectedEquipment(equipment)
    setIsDetailModalOpen(true)
    setIsSearchOpen(false)
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "NEW":
        return "Новое"
      case "WORKING":
        return "Рабочее"
      case "NEEDS_REPAIR":
        return "Требуется ремонт"
      case "DISPOSED":
        return "Утилизировано"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "WORKING":
        return "bg-green-100 text-green-800 border-green-200"
      case "NEEDS_REPAIR":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "DISPOSED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const parseSpecifications = (specString: string | null) => {
    if (!specString) return null
    try {
      return typeof specString === "string" ? JSON.parse(specString) : specString
    } catch {
      return null
    }
  }

  const renderSpecifications = (equipment: Tequipment) => {
    const specs = []

    // Computer specifications
    if (equipment.computer_details || equipment.computer_specification_data) {
      const computerSpecs = parseSpecifications(equipment.computer_details) || equipment.computer_specification_data
      if (computerSpecs) {
        specs.push(
          <div key="computer" className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Характеристики компьютера</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {computerSpecs.cpu && (
                <div>
                  <span className="font-medium">CPU:</span> {computerSpecs.cpu}
                </div>
              )}
              {computerSpecs.ram && (
                <div>
                  <span className="font-medium">RAM:</span> {computerSpecs.ram}
                </div>
              )}
              {computerSpecs.storage && (
                <div>
                  <span className="font-medium">Накопитель:</span> {computerSpecs.storage}
                </div>
              )}
              {computerSpecs.monitor_size && (
                <div>
                  <span className="font-medium">Монитор:</span> {computerSpecs.monitor_size}"
                </div>
              )}
              <div>
                <span className="font-medium">Клавиатура:</span> {computerSpecs.has_keyboard ? "Есть" : "Нет"}
              </div>
              <div>
                <span className="font-medium">Мышь:</span> {computerSpecs.has_mouse ? "Есть" : "Нет"}
              </div>
            </div>
          </div>,
        )
      }
    }

    // Projector specifications
    if (equipment.projector_char || equipment.projector_specification_data) {
      const projectorSpecs = parseSpecifications(equipment.projector_char) || equipment.projector_specification_data
      if (projectorSpecs) {
        specs.push(
          <div key="projector" className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Характеристики проектора</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {projectorSpecs.model && (
                <div>
                  <span className="font-medium">Модель:</span> {projectorSpecs.model}
                </div>
              )}
              {projectorSpecs.lumens && (
                <div>
                  <span className="font-medium">Яркость:</span> {projectorSpecs.lumens} lm
                </div>
              )}
              {projectorSpecs.resolution && (
                <div>
                  <span className="font-medium">Разрешение:</span> {projectorSpecs.resolution}
                </div>
              )}
              {projectorSpecs.throw_type && (
                <div>
                  <span className="font-medium">Тип проекции:</span> {projectorSpecs.throw_type}
                </div>
              )}
            </div>
          </div>,
        )
      }
    }

    // Printer specifications
    if (equipment.printer_char || equipment.printer_specification_data) {
      const printerSpecs = parseSpecifications(equipment.printer_char) || equipment.printer_specification_data
      if (printerSpecs) {
        specs.push(
          <div key="printer" className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
            <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Характеристики принтера</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {printerSpecs.model && (
                <div>
                  <span className="font-medium">Модель:</span> {printerSpecs.model}
                </div>
              )}
              <div>
                <span className="font-medium">Тип печати:</span> {printerSpecs.color ? "Цветной" : "Чёрно-белый"}
              </div>
              <div>
                <span className="font-medium">Duplex:</span> {printerSpecs.duplex ? "Есть" : "Нет"}
              </div>
            </div>
          </div>,
        )
      }
    }

    return specs
  }

  return (
    <header className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-accent-foreground">{title}</h1>

        <div className="flex items-center gap-4">
          {/* INN Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              placeholder="Поиск по ИНН..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </form>

          {children}
        </div>
      </div>

      {/* Search Results Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Результаты поиска по ИНН: {searchQuery}</DialogTitle>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto">
            {searchResults.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Оборудование с ИНН "{searchQuery}" не найдено</p>
            ) : (
              <div className="space-y-3">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => handleEquipmentClick(item)}
                  >
                    <div className="flex justify-between items-start gap-4">
                      {/* Image if available */}
                      {item.photo && (
                        <div className="flex-shrink-0">
                          <img
                            src={item.photo || "/placeholder.svg"}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded border"
                          />
                        </div>
                      )}

                      <div className="flex-1">
                        {/* INN at top */}
                        <div className="text-lg font-mono font-bold text-blue-600 mb-1">
                          ИНН: {item.inn || `ИНН-${item.id.toString().padStart(9, "0")}`}
                        </div>

                        {/* Equipment name below */}
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 hover:text-blue-800">
                          {item.name}
                        </h3>

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <Badge className={`${getStatusColor(item.status)} border text-xs`}>
                            {getStatusText(item.status)}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>
                              {item.room_data?.number} - {item.room_data?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(item.created_at).toLocaleDateString("ru-RU")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.type_data?.name}</p>
                        <p className="text-xs text-blue-500 mt-1 hover:underline">Подробнее →</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Detailed Equipment Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Подробная информация об оборудовании</DialogTitle>
          </DialogHeader>

          {selectedEquipment && (
            <div className="space-y-6">
              {/* Equipment Photo */}
              {selectedEquipment.photo && (
                <div className="flex justify-center">
                  <img
                    src={selectedEquipment.photo || "/placeholder.svg"}
                    alt={selectedEquipment.name}
                    className="max-w-md max-h-64 object-cover rounded-lg border shadow-sm"
                  />
                </div>
              )}

              {/* Basic Information */}
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
                  {selectedEquipment.name}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">ИНН:</span>
                    <span className="ml-2 text-lg font-mono">
                      {selectedEquipment.inn || `ИНН-${selectedEquipment.id.toString().padStart(9, "0")}`}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Тип:</span>
                    <span className="ml-2">{selectedEquipment.type_data?.name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Статус:</span>
                    <Badge className={`ml-2 ${getStatusColor(selectedEquipment.status)} border`}>
                      {getStatusText(selectedEquipment.status)}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600 dark:text-gray-400">Активность:</span>
                    <span className={`ml-2 ${selectedEquipment.is_active ? "text-green-600" : "text-red-600"}`}>
                      {selectedEquipment.is_active ? "Активно" : "Неактивно"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedEquipment.description && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Описание</h4>
                  <p className="text-gray-700 dark:text-gray-300">{selectedEquipment.description}</p>
                </div>
              )}

              {/* Location Information */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Местоположение
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Комната:</span>
                    <span className="ml-2">
                      {selectedEquipment.room_data?.number} - {selectedEquipment.room_data?.name}
                    </span>
                  </div>
                  {/* Only show special cabinet if it's true */}
                  {selectedEquipment.room_data?.is_special && (
                    <div>
                      <span className="font-medium">Специальная комната:</span>
                      <span className="ml-2 text-green-600">Да</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-3">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">Технические характеристики</h4>
                {renderSpecifications(selectedEquipment).length > 0 ? (
                  <div className="space-y-3">{renderSpecifications(selectedEquipment)}</div>
                ) : (
                  <p className="text-gray-500 italic">Технические характеристики не указаны</p>
                )}
              </div>

              {/* Author and Creation Info */}
              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Информация о создании
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Автор:</span>
                    <span className="ml-2">
                      {selectedEquipment.author
                        ? `${selectedEquipment.author.first_name} ${selectedEquipment.author.last_name}`
                        : "Не указан"}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Дата создания:</span>
                    <span className="ml-2">{formatDate(selectedEquipment.created_at)}</span>
                  </div>
                  {selectedEquipment.author?.role && (
                    <div>
                      <span className="font-medium">Роль автора:</span>
                      <span className="ml-2 capitalize">{selectedEquipment.author.role}</span>
                    </div>
                  )}
                  {selectedEquipment.author?.email && (
                    <div>
                      <span className="font-medium">Email:</span>
                      <span className="ml-2">{selectedEquipment.author.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code */}
              {selectedEquipment.qr_code_url && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                  <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">QR код</h4>
                  <img
                    src={selectedEquipment.qr_code_url || "/placeholder.svg"}
                    alt="QR Code"
                    className="mx-auto w-32 h-32 border rounded mb-2"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = selectedEquipment.qr_code_url!
                      link.download = `qr-${selectedEquipment.name}.png`
                      link.click()
                    }}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Скачать QR-код
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </header>
  )
}
