import axios from "axios";
import type {
  TUniversity,
  TBlock,
  TFloor,
  TFaculty,
  TRoom,
  TInventory,
  TEquipmnetTypesRoom,
  EquipmentTypes,
  Tequipment,
} from "@/types";
import { EQUIPMENT_TYPES } from "@/types";

const api = axios.create({
  baseURL: "https://invenmaster.pythonanywhere.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const universityApi = {
  getUniversities: async (): Promise<TUniversity[]> => {
    try {
      const response = await api.get("/university/");
      return response.data;
    } catch (error) {
      console.error("Universitetlarni olishda xato:", error);
      throw error;
    }
  },

  getBlocks: async (univerId: number): Promise<TBlock[]> => {
    try {
      const response = await api.get("/university/buildings/");
      return response.data.filter(
        (block: TBlock) => block.university === univerId
      );
    } catch (error) {
      console.error("Bloklarni olishda xato:", error);
      throw error;
    }
  },

  getFloors: async (): Promise<TFloor[]> => {
    try {
      const response = await api.get("/university/floors/");
      return response.data;
    } catch (error) {
      console.error("Qavatlarni olishda xato:", error);
      throw error;
    }
  },

  getFaculties: async (params: {
    buildingId: number;
    floorId: number;
  }): Promise<TFaculty[]> => {
    try {
      const response = await api.get(
        `/university/faculties/?building_id=${params.buildingId}&floor_id=${params.floorId}`
      );
      return response.data.filter(
        (faculty: TFaculty) =>
          faculty.building === params.buildingId &&
          faculty.floor === params.floorId
      );
    } catch (error) {
      console.error("Fakultetlarni olishda xato:", error);
      throw error;
    }
  },

  getRooms: async (): Promise<TRoom[]> => {
    try {
      const response = await api.get("/university/rooms/");
      return response.data;
    } catch (error) {
      console.error("Xonalarni olishda xato:", error);
      throw error;
    }
  },

  getEquipmentByRoom: async (roomId: number): Promise<TInventory> => {
    try {
      const response = await api.get(
        `/inventory/equipment/equipment-by-room/${roomId}/`
      );
      return response.data;
    } catch (error) {
      console.error("Jihozlarni olishda xato:", error);
      throw error;
    }
  },

  getEquipments: async (): Promise<TInventory> => {
    try {
      const response = await api.get("/inventory/equipment/");
      return response.data;
    } catch (error) {
      console.error("Barcha jihozlarni olishda xato:", error);
      throw error;
    }
  },

  // FIXED: Group equipment by type for specific room
  getEquipmentsTypesRoom: async (
    roomId: number
  ): Promise<TEquipmnetTypesRoom[]> => {
    try {
      const response = await api.get(`inventory/equipment/my-equipments/`);

      // Filter equipment for the specific room
      const equipmentsForRoom = response.data.filter(
        (equipment: Tequipment) => equipment.room === roomId
      );

      // Group equipment by type
      const groupedEquipment: TEquipmnetTypesRoom[] = [];

      // Iterate through all equipment types
      Object.entries(EQUIPMENT_TYPES).forEach(([typeId, typeName]) => {
        const equipmentOfType = equipmentsForRoom.filter(
          (equipment: Tequipment) => equipment.type === parseInt(typeId)
        );

        // Only add to result if there are equipment of this type
        if (equipmentOfType.length > 0) {
          groupedEquipment.push({
            name: typeName,
            items: equipmentOfType,
          });
        }
      });

      console.log("Grouped equipment for room", roomId, ":", groupedEquipment);
      return groupedEquipment;
    } catch (error) {
      console.error("Jihoz turlarini olishda xato:", error);
      throw error;
    }
  },

  getEquipmentTypes: async (): Promise<EquipmentTypes[]> => {
    try {
      const response = await api.get("/inventory/equipment-types/");
      return response.data;
    } catch (error) {
      console.error("Jihoz turlarini olishda xato:", error);
      throw error;
    }
  },
};
