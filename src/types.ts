import type React from "react";
// src/types.ts - Fixed version with complete types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: string;
  quantity: number;
}

export interface RecentAction {
  id: string;
  title: string;
  category: string;
  type: string;
  time: string;
}

export type TInventoryType = {
  id: number;
  name: string;
};

export type TUniversity = {
  id: number;
  name: string;
  address: string;
  logo?: string | null;
};

export type TBlock = {
  id: number;
  name: string;
  photo: string | null;
  university: number;
  address: string;
};

export type TFloor = {
  id: number;
  number: number;
  building: number;
  description?: string;
};

export type TFaculty = {
  id: number;
  name: string;
  photo: string | null;
  building: number;
  floor: number;
};

export interface TRoom {
  id: number;
  number: string;
  name: string;
  is_special: boolean;
  photo: string | null;
  qr_code?: string;
  qr_code_url?: string;
  floor: number;
  building: number;
  derived_from: number | null;
  derived_from_display: string | null;
}

export interface TAuthor {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  email: string;
  profile_picture: string | null;
  role: string;
}

export interface Tequipment {
  id: number;
  type: number;
  type_data?: {
    id: number;
    name: string;
    requires_computer_details: boolean;
  };
  room: number;
  room_data?: TRoom;
  name: string;
  photo: string | null;
  description: string;
  is_active: boolean;
  contract: number | null;
  created_at: string;

  // Specifications data
  computer_details: string | null;
  computer_specification_data?: any | null;
  printer_char: string | null;
  printer_specification_data?: any | null;
  extender_char: string | null;
  extender_specification_data?: any | null;
  router_char: string | null;
  router_specification_data?: any | null;
  tv_char: string | null;
  tv_specification_data?: any | null;
  notebook_char: string | null;
  notebook_specification_data?: any | null;
  monoblok_char: string | null;
  monoblok_specification_data?: any | null;
  projector_char: string | null;
  projector_specification_data?: any | null;
  whiteboard_char: string | null;
  whiteboard_specification_data?: any | null;

  status: string;
  qr_code_url?: string | null;
  uid: string;
  inn?: number;
  author?: TAuthor;
}

export interface TInventory {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results: Tequipment[];
}

export interface TEquipmnetTypesRoom {
  name: string;
  items: Tequipment[];
}

export interface universityType {
  universities: TUniversity[];
  blocks: TBlock[];
  floors: TFloor[];
  faculties: TFaculty[];
  rooms: TRoom[];
  inventories: TInventory[];
}

export interface EquipmentTypes {
  icon?: React.ReactNode;
  name: string;
  color?: string;
  id: number;
  requires_computer_details?: boolean;
}

export interface createFormPropsType {
  equipmentFormData: createEquipmentBodyType;
  setEquipmentFormData: React.Dispatch<
    React.SetStateAction<createEquipmentBodyType>
  >;
  create?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Update TCompSpecifications to remove monitor_size
export interface TCompSpecifications {
  id?: number;
  cpu: string;
  ram: string;
  storage: string;
  has_keyboard: boolean;
  has_mouse: boolean;
  video_card?: string; // Add video card
  disk_type?: "m2_ssd" | "sata_ssd" | "hdd"; // Add disk type
}

// Add Monitor specifications
export interface MonitorSpecs {
  id?: number;
  model: string;
  screen_size: number;
  resolution: string;
  panel_type: "ips" | "va" | "tn" | "oled";
  refresh_rate: number;
  ports: {
    hdmi: boolean;
    vga: boolean;
    dvi: boolean;
    displayport: boolean;
  };
}

// Update other specs to include video card and disk type where applicable
export interface MonoblokSpecs {
  id?: number;
  cpu: string;
  ram: string;
  storage: string;
  has_keyboard: boolean;
  has_mouse: boolean;
  screen_size: string;
  model: string;
  touch_type: "infrared" | "capacitive";
  video_card?: string;
  disk_type?: "m2_ssd" | "sata_ssd" | "hdd";
}

export interface LaptopSpecs {
  id?: number;
  cpu: string;
  ram: string;
  storage: string;
  monitor_size: string;
  video_card?: string;
  disk_type?: "m2_ssd" | "sata_ssd" | "hdd";
}

export interface charCompType {
  cpu: string;
  ram: string;
  storage: string;
  template: number;
  mouse: boolean;
  keyboard: boolean;
  quantity: number;
  monitorSize: string;
  computer_specification_id: number | string;
}

export interface SetInnType {
  id: number;
  inn: string;
  name: string;
}

// Specifications for each equipment type
export interface ProjectorSpecs {
  id?: number;
  model: string;
  lumens: number;
  resolution: string;
  throw_type: string;
}

export interface TVSpecs {
  id?: number;
  screen_size: number | null;
  model: string;
}

export interface PrinterSpecs {
  id?: number;
  model: string;
  color: boolean;
  duplex: boolean;
}

export interface ElectronBoardSpecs {
  id?: number;
  model: string;
  screen_size: number | null;
  touch_type: "infrared" | "capacitive";
}

export interface RouterSpecs {
  id?: number;
  model: string;
  ports: number | null;
  wifi_standart: string;
}

export type EquipmentSpecs =
  | TCompSpecifications
  | ProjectorSpecs
  | MonoblokSpecs
  | TVSpecs
  | PrinterSpecs
  | LaptopSpecs
  | ElectronBoardSpecs
  | RouterSpecs
  | MonitorSpecs;

export const EQUIPMENT_TYPES: Record<number, string> = {
  2: "Компьютер",
  4: "Моноблок",
  3: "Принтер",
  1: "Проектор",
  5: "Электронная доска",
  6: "Телевизор",
  7: "Ноутбук",
  8: "Роутер",
  9: "Монитор",
  10: "Удлинитель",
};

// Update createEquipmentBodyType to include monitor
export interface createEquipmentBodyType {
  type_id: number;
  room_id: number;
  description: string;
  photo?: File;
  is_active: boolean;
  name: string;
  status: string;
  contract_id: number | null;
  count: number;
  name_prefix: string;

  // Add monitor specifications
  computer_details: TCompSpecifications | null;
  printer_char: PrinterSpecs | null;
  extender_char: any | null;
  router_char: RouterSpecs | null;
  tv_char: TVSpecs | null;
  notebook_char: LaptopSpecs | null;
  monoblok_char: MonoblokSpecs | null;
  projector_char: ProjectorSpecs | null;
  whiteboard_char: ElectronBoardSpecs | null;
  monitor_char: MonitorSpecs | null; // Add this

  // Add monitor specification ID
  computer_specification_id: number | null;
  printer_specification_id: number | null;
  extender_specification_id: number | null;
  router_specification_id: number | null;
  tv_specification_id: number | null;
  notebook_specification_id: number | null;
  monoblok_specification_id: number | null;
  projector_specification_id: number | null;
  whiteboard_specification_id: number | null;
  monitor_specification_id: number | null; // Add this
}
