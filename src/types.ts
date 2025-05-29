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
};
export type TBlock = {
  id: number;
  name: string;
  photo: string;
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
  photo: string;
  building: number;
  floor: number;
};
export interface TRoom {
  id: number;
  number: string;
  name: string;
  is_special: boolean;
  photo: string | null;
  qr_code: string;
  qr_code_url: string;
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

// export interface TInventory {
//   id: number;
//   type: number;
//   type_data: {
//     id: number;
//     name: string;
//     requires_computer_details: boolean;
//   };
//   room: number;
//   room_data: TRoom;
//   name: string;
//   photo: string | null;
//   description: string;
//   is_active: boolean;
//   contract: string | null;
//   created_at: string;
//   computer_details: string | null;
//   computer_specification_data: string | null;
//   printer_char: string | null;
//   printer_specification_data: string | null;
//   extender_char: string | null;
//   extender_specification_data: string | null;
//   router_char: string | null;
//   router_specification_data: string | null;
//   tv_char: string | null;
//   tv_specification_data: string | null;
//   status: string;
//   qr_code_url: string;
//   uid: string;
//   author: TAuthor;
// }

export interface Tequipment{
  id: number;
  type: number;
  type_data: {
    id: number;
    name: string;
    requires_computer_details: boolean;
  };
  room: number;
  room_data: TRoom;
  name: string;
  photo: string | null;
  description: string;
  is_active: boolean;
  contract: string | null;
  created_at: string;
  computer_details: string | null;
  computer_specification_data: string | null;
  printer_char: string | null;
  printer_specification_data: string | null;
  extender_char: string | null;
  extender_specification_data: string | null;
  router_char: string | null;
  router_specification_data: string | null;
  tv_char: string | null;
  tv_specification_data: string | null;
  status: string;
  qr_code_url: string;
  uid: string;
  author: TAuthor;
}
export interface TInventory {
  count?: number;
  next?: string;
  previus?: string;
  results: Tequipment[]
}

export interface TEquipmnetTypesRoom{
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
  icon: React.ReactNode;
  name: string;
  color: string;
  id: number;
  requires_computer_details: boolean;
}

export interface createFormPropsType {
  equipmentFormData: createEquipmentBodyType;
  setEquipmentFormData: React.Dispatch<React.SetStateAction<createEquipmentBodyType>>;
  create?: boolean;
  onOpenChange?: (open: boolean) => void
}

export interface TCompSpecifications {
  id?: number;
  cpu: string;
  ram: string;
  storage: string;
  has_keyboard: boolean;
  has_mouse: boolean;
  monitor_size: string;
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

export interface MonoblokSpecs {
  id?: number;
  cpu: string;
  ram: string;
  storage: string;
  has_keyboard: boolean;
  has_mouse: boolean;
  screen_size: string;
  model: string;
  touch_type: 'infrared' | 'capacitive'
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

export interface LaptopSpecs {
  id?: number;
  cpu: string;
  ram: string;
  storage: string;
  monitor_size: string;
}

export interface ElectronBoardSpecs {
  id?: number;
  model: string;
  screen_size: number | null;
  touch_type: 'infrared' | 'capacitive'
}
export interface RouterSpecs {
  id?: number;
  model: string;
  ports: number | null;
  wifi_standart: string
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

export const EQUIPMENT_TYPES: Record<number, string> = {
  1: "Проектор",
  2: "Компьютер",
  3: "Принтер",
  4: "Моноблок",
  5: "Электронная доска",
  6: "Телевизор",
  7: "Ноутбук",
  8: "Роутер",
};

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
  computer_details: TCompSpecifications | null
  printer_char: PrinterSpecs | null
  extender_char: string | null
  router_char: RouterSpecs | null
  tv_char: TVSpecs | null
  notebook_char: LaptopSpecs | null
  monoblok_char: MonoblokSpecs | null
  projector_char: ProjectorSpecs | null
  whiteboard_char: ElectronBoardSpecs | null
  computer_specification_id: number | null
  printer_specification_id: number | null
  extender_specification_id: number | null
  router_specification_id: number | null
  tv_specification_id: number | null
  notebook_specification_id: number | null
  monoblok_specification_id: number | null
  projector_specification_id: number | null
  whiteboard_specification_id: number | null
}