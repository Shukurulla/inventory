"use client"

import type React from "react"

import type { SetInnType } from "@/types"
import { Input } from "./ui/input"
import { Skeleton } from "./ui/skeleton"
import { Button } from "./ui/button"
import { Download, FileText } from "lucide-react"

const AddInnForm = ({
  formDataThird,
  setFormDataThird,
  isLoading,
}: {
  formDataThird: SetInnType[]
  setFormDataThird: React.Dispatch<React.SetStateAction<SetInnType[]>>
  isLoading: boolean
}) => {
  const downloadAllQRCodes = async () => {
    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("https://invenmaster.pythonanywhere.com/inventory/equipment/download-qr-codes/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipment_ids: formDataThird.map((item) => item.id),
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "qr-codes.pdf"
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error downloading QR codes:", error)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      {/* Download All Button */}
      <div className="flex justify-end mb-4">
        <Button
          onClick={downloadAllQRCodes}
          className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          disabled={formDataThird.length === 0}
        >
          <FileText size={16} />
          Скачать все QR-коды (PDF)
        </Button>
      </div>

      {/* Scrollable container */}
      <div className="max-h-96 overflow-y-auto space-y-4">
        {isLoading && (
          <div className="flex flex-col space-y-2">
            <div className="w-full flex items-center gap-2">
              <Skeleton className="flex-1 h-12 bg-gray-200 dark:bg-card" />
              <Skeleton className="flex-1 h-12 bg-gray-200 dark:bg-card" />
            </div>
            <div className="w-full flex items-center gap-2">
              <Skeleton className="flex-1 h-12 bg-gray-200 dark:bg-card" />
              <Skeleton className="flex-1 h-12 bg-gray-200 dark:bg-card" />
            </div>
          </div>
        )}

        {!isLoading &&
          formDataThird.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 mb-3 h-12">
                <p className="text-xl w-1/2 border h-full flex items-center justify-center rounded-lg text-accent-foreground bg-gray-50">
                  {item.name}
                </p>
                <Input
                  placeholder="ИНН"
                  className="w-1/2 h-full text-accent-foreground"
                  value={item.inn}
                  onChange={(e) => {
                    const newFormData = [...formDataThird]
                    newFormData[index].inn = e.target.value
                    setFormDataThird(newFormData)
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium text-accent-foreground">QR-код</p>
                <Button
                  variant="secondary"
                  className="gap-1"
                  onClick={() => {
                    // Individual QR code download
                    const link = document.createElement("a")
                    link.href = `https://invenmaster.pythonanywhere.com/inventory/equipment/${item.id}/qr-code/`
                    link.download = `qr-${item.name}.png`
                    link.click()
                  }}
                >
                  <Download size={16} /> Скачать
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default AddInnForm
