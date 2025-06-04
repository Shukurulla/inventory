// src/api/universityApi.ts - Fixed with Complete Postman Endpoints
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./Auth/BaseQueryWithReauth";
import type {
  ElectronBoardSpecs,
  EquipmentTypes,
  LaptopSpecs,
  MonoblokSpecs,
  PrinterSpecs,
  ProjectorSpecs,
  RouterSpecs,
  TBlock,
  TCompSpecifications,
  Tequipment,
  TEquipmnetTypesRoom,
  TFaculty,
  TFloor,
  TInventory,
  TRoom,
  TUniversity,
  TVSpecs,
} from "@/types";

// Equipment Update Types - Complete interface based on Postman collection
interface EquipmentUpdateRequest {
  type: number; // Type is required
  name?: string;
  description?: string;
  status?: string;
  room?: number;
  is_active?: boolean;
  contract?: number | null;
  inn?: number;
  photo?: File;

  // Computer/Monoblock specifications
  computer_details?: {
    cpu: string;
    ram: string;
    storage: string;
    has_keyboard: boolean;
    has_mouse: boolean;
    monitor_size: string;
  };
  computer_specification_id?: number | null;

  // Projector specifications
  projector_char?: {
    model: string;
    lumens: number;
    resolution: string;
    throw_type: string;
  };
  projector_specification_id?: number | null;

  // Printer specifications
  printer_char?: {
    model: string;
    color: boolean;
    duplex: boolean;
  };
  printer_specification_id?: number | null;

  // Extender specifications
  extender_char?: {
    ports: number;
    length: number;
  };
  extender_specification_id?: number | null;

  // Router specifications
  router_char?: {
    model: string;
    ports: number | null;
    wifi_standart: string;
  };
  router_specification_id?: number | null;

  // TV specifications
  tv_char?: {
    model: string;
    screen_size: number | null;
  };
  tv_specification_id?: number | null;

  // Notebook specifications
  notebook_char?: {
    cpu: string;
    ram: string;
    storage: string;
    monitor_size: string;
  };
  notebook_specification_id?: number | null;

  // Monoblock specifications
  monoblok_char?: {
    cpu: string;
    ram: string;
    storage: string;
    has_keyboard: boolean;
    has_mouse: boolean;
    screen_size: string;
    model: string;
    touch_type: "infrared" | "capacitive";
  };
  monoblok_specification_id?: number | null;

  // Electronic board specifications
  whiteboard_char?: {
    model: string;
    screen_size: number | null;
    touch_type: "infrared" | "capacitive";
  };
  whiteboard_specification_id?: number | null;
}

// Equipment Search and Filter Types
interface EquipmentFilterParams {
  building_id?: number;
  room_id?: number;
  type_id?: number;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Equipment Move Request Type
interface MoveEquipmentRequest {
  equipment_ids: number[];
  to_room_id: number;
  from_room_id?: number;
}

// Bulk Status Update Request Type
interface BulkStatusUpdateRequest {
  updates: Array<{
    id: number;
    status: string;
  }>;
}

// Bulk INN Update Request Type
interface BulkInnUpdateRequest {
  equipments: Array<{
    id: number;
    inn: number;
  }>;
}

// Bulk Create Equipment Request Type
interface BulkCreateEquipmentRequest {
  type_id: number;
  room_id: number;
  description: string;
  status: string;
  contract_id: number | null;
  count: number;
  name_prefix: string;
  is_active?: boolean;
  [key: string]: any; // For various specification objects
}

// QR Scan Request Type
interface QRScanRequest {
  qr_data: string;
}

// Equipment Actions Response Type
interface EquipmentAction {
  id: string;
  name: string;
  category: string;
  type: string;
  time: string;
  created_at: string;
  user: string;
}

export const universityApi = createApi({
  reducerPath: "universityApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Equipment",
    "EquipmentByRoom",
    "EquipmentTypesRoom",
    "Inventory",
    "Specifications",
  ],
  endpoints: (builder) => ({
    // University structure endpoints
    getUniversities: builder.query<TUniversity[], void>({
      query: () => `university/`,
    }),
    getBlocks: builder.query<TBlock[], { univerId: number }>({
      query: () => `/university/buildings/`,
      transformResponse: (response: TBlock[], _meta, arg) => {
        return response.filter((block) => block.university === arg.univerId);
      },
    }),
    getFloors: builder.query<TFloor[], void>({
      query: () => `university/floors/`,
    }),
    getFaculties: builder.query<
      TFaculty[],
      { buildingId: number; floorId: number }
    >({
      query: ({ buildingId, floorId }) =>
        `university/faculties/?building_id=${buildingId}&floor_id=${floorId}`,
      transformResponse: (response: TFaculty[], _meta, arg) => {
        return response.filter(
          (faculty) =>
            faculty.building === arg.buildingId && faculty.floor === arg.floorId
        );
      },
    }),
    getRooms: builder.query<TRoom[], void>({
      query: () => `/university/rooms/`,
    }),

    // Equipment endpoints
    getEquipmentByRoom: builder.query<TInventory, { roomId: number }>({
      query: ({ roomId }) => `inventory/equipment/equipment-by-room/${roomId}/`,
      providesTags: (result, error, { roomId }) => [
        { type: "EquipmentByRoom", id: roomId },
        { type: "Equipment", id: "LIST" },
      ],
    }),
    getEquipments: builder.query<TInventory, void>({
      query: () => `/inventory/equipment/`,
      providesTags: [{ type: "Equipment", id: "LIST" }],
    }),
    getEquipmentsTypesRoom: builder.query<
      TEquipmnetTypesRoom[],
      { roomId: number }
    >({
      query: ({ roomId }) => `/inventory/equipment/by-room/${roomId}/data/`,
      providesTags: (result, error, { roomId }) => [
        { type: "EquipmentTypesRoom", id: roomId },
        { type: "Equipment", id: "LIST" },
      ],
    }),
    getEquipmentTypes: builder.query<EquipmentTypes[], void>({
      query: () => `/inventory/equipment-types/`,
    }),
    getAddedEquipments: builder.query<Tequipment[], void>({
      query: () => `/inventory/equipment/my-equipments/`,
      providesTags: [{ type: "Equipment", id: "MY_LIST" }],
      transformResponse: (response: any) => {
        if (Array.isArray(response)) {
          return response;
        } else if (
          response &&
          response.results &&
          Array.isArray(response.results)
        ) {
          return response.results;
        } else if (response && response.data && Array.isArray(response.data)) {
          return response.data;
        }
        return [];
      },
    }),

    // Equipment search and filter
    getFilteredEquipments: builder.query<TInventory, EquipmentFilterParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        return `inventory/equipment/filter/?${searchParams.toString()}`;
      },
      providesTags: [{ type: "Equipment", id: "FILTERED" }],
    }),

    // Equipment actions and history
    getMyActions: builder.query<EquipmentAction[], void>({
      query: () => `inventory/equipment/my-actions/`,
    }),
    getMovementHistory: builder.query<any[], void>({
      query: () => `inventory/movement-history/`,
    }),

    // QR Code scanning
    scanQRCode: builder.mutation<Tequipment, QRScanRequest>({
      query: (body) => ({
        url: `inventory/equipment/scan-qr/`,
        method: "POST",
        body,
      }),
    }),

    // Equipment specifications queries
    getSpecComputer: builder.query<TCompSpecifications[], void>({
      query: () => `inventory/computer-specifications/`,
      providesTags: [{ type: "Specifications", id: "COMPUTER" }],
    }),
    getSpecProjector: builder.query<ProjectorSpecs[], void>({
      query: () => `/inventory/projector-specification/`,
      providesTags: [{ type: "Specifications", id: "PROJECTOR" }],
    }),
    getPrinterSpecs: builder.query<PrinterSpecs[], void>({
      query: () => `inventory/printer-specification/`,
      providesTags: [{ type: "Specifications", id: "PRINTER" }],
    }),
    getMonoblokSpecs: builder.query<MonoblokSpecs[], void>({
      query: () => `inventory/monoblok-specification/`,
      providesTags: [{ type: "Specifications", id: "MONOBLOCK" }],
    }),
    getElectronicBoardSpecs: builder.query<ElectronBoardSpecs[], void>({
      query: () => `inventory/whiteboard-specification/`,
      providesTags: [{ type: "Specifications", id: "WHITEBOARD" }],
    }),
    getTvSpecs: builder.query<TVSpecs[], void>({
      query: () => `inventory/tv-specification/`,
      providesTags: [{ type: "Specifications", id: "TV" }],
    }),
    getLaptopSpecs: builder.query<LaptopSpecs[], void>({
      query: () => `inventory/notebook-specification/`,
      providesTags: [{ type: "Specifications", id: "LAPTOP" }],
    }),
    getRouterSpecs: builder.query<RouterSpecs[], void>({
      query: () => `inventory/router-specification/`,
      providesTags: [{ type: "Specifications", id: "ROUTER" }],
    }),
    getSpecificationCount: builder.query<any, void>({
      query: () => `inventory/specifications/specification-count/`,
      providesTags: [{ type: "Specifications", id: "COUNT" }],
    }),

    // Create specification endpoints
    createSpecComputer: builder.mutation<void, TCompSpecifications>({
      query: (body) => ({
        url: `inventory/create-comp-spec/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Specifications", id: "COMPUTER" }],
    }),
    createSpecProjector: builder.mutation<void, ProjectorSpecs>({
      query: (body) => ({
        url: `/inventory/projector-specification/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Specifications", id: "PROJECTOR" }],
    }),
    createPrinterSpecs: builder.mutation<void, PrinterSpecs>({
      query: (body) => ({
        url: `inventory/printer-specification/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Specifications", id: "PRINTER" }],
    }),
    createMonoblokSpecs: builder.mutation<void, MonoblokSpecs>({
      query: (body) => ({
        url: `inventory/monoblok-specification/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Specifications", id: "MONOBLOCK" }],
    }),
    createElectronicBoardSpecs: builder.mutation<void, ElectronBoardSpecs>({
      query: (body) => ({
        url: `inventory/whiteboard-specification/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Specifications", id: "WHITEBOARD" }],
    }),
    createTvSpecs: builder.mutation<void, TVSpecs>({
      query: (body) => ({
        url: `inventory/tv-specification/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Specifications", id: "TV" }],
    }),
    createLaptopSpecs: builder.mutation<void, LaptopSpecs>({
      query: (body) => ({
        url: `inventory/notebook-specification/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Specifications", id: "LAPTOP" }],
    }),
    createRouterSpecs: builder.mutation<void, RouterSpecs>({
      query: (body) => ({
        url: `inventory/router-specification/`,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Specifications", id: "ROUTER" }],
    }),

    // Equipment CRUD operations
    bulkCreateEquipment: builder.mutation<
      Tequipment[],
      BulkCreateEquipmentRequest
    >({
      query: (body) => ({
        url: "inventory/equipment/bulk-create/",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, args) => {
        const tags: (
          | { type: "Equipment"; id: string }
          | { type: "EquipmentByRoom"; id: string }
          | { type: "EquipmentTypesRoom"; id: string }
          | { type: "Inventory"; id: string }
        )[] = [
          { type: "Equipment", id: "LIST" },
          { type: "Equipment", id: "MY_LIST" },
          { type: "Inventory", id: "LIST" },
        ];

        if (args.room_id) {
          tags.push(
            { type: "EquipmentByRoom", id: args.room_id.toString() },
            { type: "EquipmentTypesRoom", id: args.room_id.toString() }
          );
        }

        return tags;
      },
    }),

    // Full equipment update (PUT method)
    updateEquipment: builder.mutation<
      Tequipment,
      { id: number; data: EquipmentUpdateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/inventory/equipment/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Equipment", id: id.toString() },
        { type: "Equipment", id: "LIST" },
        { type: "Equipment", id: "MY_LIST" },
        { type: "Inventory", id: "LIST" },
      ],
    }),

    // Partial equipment update (PATCH method)
    // universityApi.ts fayliga qo'shing (endpoints ichiga)

    // Partial equipment update (PATCH method) - mavjud bo'lsa yangilang
    patchEquipment: builder.mutation<
      Tequipment,
      { id: number; data: Partial<any> }
    >({
      query: ({ id, data }) => {
        // FormData yaratish agar file bo'lsa
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (key === "photo" && value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === "object" && !(value instanceof File)) {
              // Object turindagi ma'lumotlarni JSON string qilib yuborish
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });

        return {
          url: `/inventory/equipment/${id}/`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Equipment", id: id.toString() },
        { type: "Equipment", id: "LIST" },
        { type: "Equipment", id: "MY_LIST" },
        { type: "Inventory", id: "LIST" },
      ],
    }),

    // Equipment bulk operations
    bulkUpdateInn: builder.mutation<void, BulkInnUpdateRequest>({
      query: (body) => ({
        url: "/inventory/equipment/bulk-update-inn/",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Equipment", id: "LIST" },
        { type: "Equipment", id: "MY_LIST" },
      ],
    }),

    updateEquipmentStatus: builder.mutation<
      Tequipment,
      { equipmentId: number; statusData: EquipmentStatusUpdate }
    >({
      query: ({ equipmentId, statusData }) => ({
        url: `/inventory/equipment/${equipmentId}/`,
        method: "PATCH",
        body: statusData,
      }),
      invalidatesTags: (result, error, { equipmentId }) => [
        { type: "Equipment", id: equipmentId.toString() },
        { type: "Equipment", id: "LIST" },
        { type: "Equipment", id: "MY_LIST" },
        { type: "Inventory", id: "LIST" },
      ],
    }),
    updateSpecComputer: builder.mutation<
      TCompSpecifications,
      { id: number; data: Partial<TCompSpecifications> }
    >({
      query: ({ id, data }) => ({
        url: `inventory/computer-specifications/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Specifications", id: "COMPUTER" }],
    }),

    updateSpecProjector: builder.mutation<
      ProjectorSpecs,
      { id: number; data: Partial<ProjectorSpecs> }
    >({
      query: ({ id, data }) => ({
        url: `inventory/projector-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Specifications", id: "PROJECTOR" }],
    }),

    updatePrinterSpecs: builder.mutation<
      PrinterSpecs,
      { id: number; data: Partial<PrinterSpecs> }
    >({
      query: ({ id, data }) => ({
        url: `inventory/printer-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Specifications", id: "PRINTER" }],
    }),

    updateMonoblokSpecs: builder.mutation<
      MonoblokSpecs,
      { id: number; data: Partial<MonoblokSpecs> }
    >({
      query: ({ id, data }) => ({
        url: `inventory/monoblok-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Specifications", id: "MONOBLOCK" }],
    }),

    updateElectronicBoardSpecs: builder.mutation<
      ElectronBoardSpecs,
      { id: number; data: Partial<ElectronBoardSpecs> }
    >({
      query: ({ id, data }) => ({
        url: `inventory/whiteboard-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Specifications", id: "WHITEBOARD" }],
    }),

    updateTvSpecs: builder.mutation<
      TVSpecs,
      { id: number; data: Partial<TVSpecs> }
    >({
      query: ({ id, data }) => ({
        url: `inventory/tv-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Specifications", id: "TV" }],
    }),

    updateLaptopSpecs: builder.mutation<
      LaptopSpecs,
      { id: number; data: Partial<LaptopSpecs> }
    >({
      query: ({ id, data }) => ({
        url: `inventory/notebook-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Specifications", id: "LAPTOP" }],
    }),

    updateRouterSpecs: builder.mutation<
      RouterSpecs,
      { id: number; data: Partial<RouterSpecs> }
    >({
      query: ({ id, data }) => ({
        url: `inventory/router-specification/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [{ type: "Specifications", id: "ROUTER" }],
    }),

    bulkUpdateEquipmentStatuses: builder.mutation<
      void,
      BulkStatusUpdateRequest
    >({
      query: (body) => ({
        url: "/inventory/equipment/bulk-update-status/",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "Equipment", id: "LIST" },
        { type: "Equipment", id: "MY_LIST" },
      ],
    }),

    // Equipment movement
    moveEquipments: builder.mutation<void, MoveEquipmentRequest>({
      query: (body) => ({
        url: `inventory/equipment/move-equipment/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { to_room_id, from_room_id }) => {
        const tags = [
          { type: "Equipment", id: "LIST" },
          { type: "EquipmentByRoom", id: to_room_id.toString() },
          { type: "EquipmentTypesRoom", id: to_room_id.toString() },
        ];

        if (from_room_id) {
          tags.push(
            { type: "EquipmentByRoom", id: from_room_id.toString() },
            { type: "EquipmentTypesRoom", id: from_room_id.toString() }
          );
        }

        return tags;
      },
    }),

    // Equipment deletion
    deleteEquipments: builder.mutation<void, { ids: number[] }>({
      query: (body) => ({
        url: `/inventory/equipment/bulk-delete/`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: [
        { type: "Equipment", id: "LIST" },
        { type: "Equipment", id: "MY_LIST" },
      ],
    }),

    // Individual equipment operations
    getEquipmentById: builder.query<Tequipment, number>({
      query: (id) => `/inventory/equipment/${id}/`,
      providesTags: (result, error, id) => [
        { type: "Equipment", id: id.toString() },
      ],
    }),

    deleteEquipment: builder.mutation<void, number>({
      query: (id) => ({
        url: `/inventory/equipment/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Equipment", id: id.toString() },
        { type: "Equipment", id: "LIST" },
        { type: "Equipment", id: "MY_LIST" },
      ],
    }),

    // Equipment repair operations
    sendToRepair: builder.mutation<void, number>({
      query: (id) => ({
        url: `/inventory/equipment/${id}/send-to-repair/`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Equipment", id: id.toString() },
        { type: "Equipment", id: "LIST" },
      ],
    }),

    // Equipment disposal operations
    disposeEquipment: builder.mutation<
      void,
      { id: number; reason: string; notes?: string }
    >({
      query: ({ id, reason, notes }) => ({
        url: `/inventory/equipment/${id}/dispose/`,
        method: "POST",
        body: { reason, notes },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Equipment", id: id.toString() },
        { type: "Equipment", id: "LIST" },
      ],
    }),

    // Room management endpoints
    getRoomsByBuilding: builder.query<TRoom[], number>({
      query: (buildingId) =>
        `/inventory/equipment/rooms-by-building/${buildingId}`,
    }),
  }),
});

export const {
  // University structure
  useGetUniversitiesQuery,
  useGetBlocksQuery,
  useGetFloorsQuery,
  useGetFacultiesQuery,
  useGetRoomsQuery,

  // Equipment queries
  useGetEquipmentByRoomQuery,
  useGetEquipmentTypesQuery,
  useGetEquipmentsQuery,
  useGetEquipmentsTypesRoomQuery,
  useGetAddedEquipmentsQuery,
  useGetFilteredEquipmentsQuery,
  useGetEquipmentByIdQuery,
  useGetMyActionsQuery,
  useGetRoomsByBuildingQuery,
  useGetMovementHistoryQuery,
  useGetSpecificationCountQuery,

  // Specifications
  useGetSpecComputerQuery,
  useGetSpecProjectorQuery,
  useGetPrinterSpecsQuery,
  useGetMonoblokSpecsQuery,
  useGetElectronicBoardSpecsQuery,
  useGetTvSpecsQuery,
  useGetLaptopSpecsQuery,
  useGetRouterSpecsQuery,

  // Create specifications
  useCreateSpecComputerMutation,
  useCreateSpecProjectorMutation,
  useCreatePrinterSpecsMutation,
  useCreateMonoblokSpecsMutation,
  useCreateElectronicBoardSpecsMutation,
  useCreateTvSpecsMutation,
  useCreateLaptopSpecsMutation,
  useCreateRouterSpecsMutation,

  // Equipment mutations
  useBulkCreateEquipmentMutation,
  useUpdateEquipmentMutation,
  usePatchEquipmentMutation,
  useDeleteEquipmentMutation,
  useDeleteEquipmentsMutation,

  // Bulk operations
  useBulkUpdateInnMutation,
  useUpdateEquipmentStatusMutation,
  useBulkUpdateEquipmentStatusesMutation,
  useUpdateSpecComputerMutation,
  useUpdateSpecProjectorMutation,
  useUpdatePrinterSpecsMutation,
  useUpdateMonoblokSpecsMutation,
  useUpdateElectronicBoardSpecsMutation,
  useUpdateTvSpecsMutation,
  useUpdateLaptopSpecsMutation,
  useUpdateRouterSpecsMutation,
  // Equipment actions
  useMoveEquipmentsMutation,
  useSendToRepairMutation,
  useDisposeEquipmentMutation,
  useScanQRCodeMutation,
} = universityApi;
