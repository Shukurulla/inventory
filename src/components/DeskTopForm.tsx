"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ComputerSpecs {
  cpu?: string;
  ram_size?: string;
  video_card?: string;
  disk_type?: "m2_ssd" | "sata_ssd" | "hdd";
}

const DeskTopForm = () => {
  const [computerSpecs, setComputerSpecs] = useState<ComputerSpecs>({});

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cpu">Процессор</Label>
        <Input
          id="cpu"
          placeholder="Intel Core i7"
          value={computerSpecs.cpu || ""}
          onChange={(e) =>
            setComputerSpecs({ ...computerSpecs, cpu: e.target.value })
          }
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="ram-size">Объем оперативной памяти</Label>
        <Input
          id="ram-size"
          placeholder="16GB"
          value={computerSpecs.ram_size || ""}
          onChange={(e) =>
            setComputerSpecs({ ...computerSpecs, ram_size: e.target.value })
          }
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="video-card">Видеокарта</Label>
        <Input
          id="video-card"
          placeholder="NVIDIA GTX 1050"
          value={computerSpecs.video_card || ""}
          onChange={(e) =>
            setComputerSpecs({ ...computerSpecs, video_card: e.target.value })
          }
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="disk-type">Тип диска</Label>
        <Select
          value={computerSpecs.disk_type || ""}
          onValueChange={(value: "m2_ssd" | "sata_ssd" | "hdd") =>
            setComputerSpecs({ ...computerSpecs, disk_type: value })
          }
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Выберите тип диска" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m2_ssd">M.2 SSD</SelectItem>
            <SelectItem value="sata_ssd">SATA SSD</SelectItem>
            <SelectItem value="hdd">HDD</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DeskTopForm;
