import { Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import type { createEquipmentBodyType } from "@/types";
import { Label } from "@radix-ui/react-label";
import { useGetAllContractsQuery } from "@/api/contactsApi";
import { Skeleton } from "./ui/skeleton";

export const StepOneForm = ({
  data,
  setData,
}: {
  data: createEquipmentBodyType;
  setData: React.Dispatch<React.SetStateAction<createEquipmentBodyType>>;
}) => {
  const { data: contracts, isLoading } = useGetAllContractsQuery();

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

      {/* Upload Photo */}
      <div className="flex items-center gap-2 justify-between relative">
        <p className="text-lg flex-1 text-accent-foreground">
          Фото техники:
          {data.photo && (
            <span className="text-sm text-gray-500">
              {(data.photo as File).name}
            </span>
          )}
        </p>
        <Input
          type="file"
          accept="image/*"
          className="opacity-0 absolute right-0 w-32 h-14"
          id="file-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setData((prev) => ({
                ...prev,
                photo: file,
              }));
            }
          }}
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Button
            variant="secondary"
            className="gap-1 bg-indigo-600  hover:bg-indigo-400 text-white text-lg h-12"
          >
            <Upload size={16} /> Загрузить
          </Button>
        </label>
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
      <div>
        <Select
          value={data.status}
          onValueChange={(value) => setData({ ...data, status: value })}
        >
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

      {/* Checkbox */}
      <div className="flex items-center gap-2 mt-2">
        <label htmlFor="isWorking" className="text-lg text-accent-foreground">
          Техника активна работает
        </label>
        <Checkbox
          id="isWorking"
          defaultChecked={data.is_active}
          onCheckedChange={(checked) =>
            setData({ ...data, is_active: checked as boolean })
          }
          className="w-5 h-5 border-2 border-indigo-500 data-[state=checked]:border-indigo-500 data-[state=checked]:bg-indigo-600"
        />
      </div>

      {/* Contract file */}
      <div className="flex items-center gap-2">
        <Label htmlFor="template" className="text-black/40">
          Договор:
        </Label>
        <Select
          onValueChange={(value) =>
            setData({ ...data, contract_id: Number(value) })
          }
        >
          <SelectTrigger className="w-full !h-12 border-gray-300 focus:ring-indigo-600 focus:border-indigo-600">
            <SelectValue placeholder="Выберите договор" />
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
    </div>
  );
};
