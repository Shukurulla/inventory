"use client"

import type React from "react"

import { Upload } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import type { createEquipmentBodyType } from "@/types"
import { Label } from "@radix-ui/react-label"
import { useGetAllContractsQuery } from "@/api/contactsApi"
import { Skeleton } from "./ui/skeleton"

export const StepOneForm = ({
  data,
  setData,
}: {
  data: createEquipmentBodyType
  setData: React.Dispatch<React.SetStateAction<createEquipmentBodyType>>
}) => {
  const { data: contracts, isLoading } = useGetAllContractsQuery()

  const truncateFileName = (fileName: string, maxLength = 20) => {
    if (fileName.length <= maxLength) return fileName
    const extension = fileName.split(".").pop()
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."))
    const truncatedName = nameWithoutExt.substring(0, maxLength - 3 - (extension?.length || 0))
    return `${truncatedName}...${extension}`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Name */}
      <div>
        <Input
          className="h-12 text-lg text-accent-foreground"
          placeholder="Название техники"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </div>

      {/* Quantity */}
      <div>
        <Input
          type="number"
          min="1"
          max="50"
          className="h-12 text-lg text-accent-foreground"
          placeholder="Количество (макс. 50)"
          value={data.count}
          onChange={(e) => {
            const value = Math.min(50, Math.max(1, Number.parseInt(e.target.value) || 1))
            setData({ ...data, count: value })
          }}
        />
      </div>

      {/* Upload Photo */}
      <div className="flex items-center gap-2 justify-between relative">
        <p className="text-lg flex-1 text-accent-foreground">
          Фото техники:
          {data.photo && (
            <span className="text-sm text-gray-500 block">{truncateFileName((data.photo as File).name)}</span>
          )}
        </p>
        <Input
          type="file"
          accept="image/*"
          className="opacity-0 absolute right-0 w-32 h-14"
          id="file-upload"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setData((prev) => ({
                ...prev,
                photo: file,
              }))
            }
          }}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Button variant="secondary" className="gap-1 bg-indigo-600 hover:bg-indigo-400 text-white text-lg h-12">
            <Upload size={16} /> Загрузить
          </Button>
        </label>
      </div>

      {/* Contract file - Required */}
      <div className="flex items-center gap-2">
        <Label htmlFor="template" className="text-black/40">
          Договор: <span className="text-red-500">*</span>
        </Label>
        <Select
          value={data.contract_id?.toString() || ""}
          onValueChange={(value) => setData({ ...data, contract_id: Number(value) })}
          required
        >
          <SelectTrigger className="w-full !h-12 border-gray-300 focus:ring-indigo-600 focus:border-indigo-600">
            <SelectValue placeholder="Выберите договор *" />
          </SelectTrigger>
          <SelectContent>
            {isLoading ? (
              <Skeleton className="w-full border-b h-7" />
            ) : (
              contracts?.results?.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.number + " - " + item.valid_until}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <Textarea
          placeholder="Описание:"
          className="h-24 text-xl text-accent-foreground"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
      </div>

      {/* Status select */}
      <div className="md:col-span-2">
        <Select value={data.status} onValueChange={(value) => setData({ ...data, status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Состояние техники" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NEW">Новое</SelectItem>
            <SelectItem value="WORKING">Рабочее</SelectItem>
            <SelectItem value="NEEDS_REPAIR">Требуется ремонт</SelectItem>
            <SelectItem value="DISPOSED">Утилизировано</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
