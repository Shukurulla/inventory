// src/api/universityApi.ts - Fixed version
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
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./Auth/BaseQueryWithReauth";

export const universityApi = createApi({
  reducerPath: "universityApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Equipment", "EquipmentByRoom", "EquipmentTypesRoom", "Inventory"],
  endpoints: (builder) => ({
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
        console.log("getAddedEquipments raw response:", response);
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
      transformErrorResponse: (response: any) => {
        console.log("getAddedEquipments error:", response);
        return response;
      },
    }),

    // specs
    getSpecComputer: builder.query<TCompSpecifications[], void>({
      query: () => `inventory/computer-specifications/`,
    }),
    getSpecProjector: builder.query<ProjectorSpecs[], void>({
      query: () => `/inventory/projector-specification/`,
    }),
    getPrinterSpecs: builder.query<PrinterSpecs[], void>({
      query: () => `inventory/printer-specification/`,
    }),
    getMonoblokSpecs: builder.query<MonoblokSpecs[], void>({
      query: () => `inventory/monoblok-specification/`,
    }),
    getElectronicBoardSpecs: builder.query<ElectronBoardSpecs[], void>({
      query: () => `inventory/whiteboard-specification/`,
    }),
    getTvSpecs: builder.query<TVSpecs[], void>({
      query: () => `inventory/tv-specification/`,
    }),
    getLaptopSpecs: builder.query<LaptopSpecs[], void>({
      query: () => `inventory/laptop-specification/`,
    }),
    getRouterSpecs: builder.query<RouterSpecs[], void>({
      query: () => `inventory/router-specification/`,
    }),
    createSpecComputer: builder.mutation<void, TCompSpecifications>({
      query: (body) => ({
        url: `inventory/computer-specifications/`,
        method: "POST",
        body,
      }),
    }),
    createSpecProjector: builder.mutation<void, ProjectorSpecs>({
      query: (body) => ({
        url: `/inventory/projector-specification/`,
        method: "POST",
        body,
      }),
    }),
    createPrinterSpecs: builder.mutation<void, PrinterSpecs>({
      query: (body) => ({
        url: `inventory/printer-specification/`,
        method: "POST",
        body,
      }),
    }),
    createMonoblokSpecs: builder.mutation<void, MonoblokSpecs>({
      query: (body) => ({
        url: `inventory/monoblok-specification/`,
        method: "POST",
        body,
      }),
    }),
    createElectronicBoardSpecs: builder.mutation<void, ElectronBoardSpecs>({
      query: (body) => ({
        url: `inventory/whiteboard-specification/`,
        method: "POST",
        body,
      }),
    }),
    createTvSpecs: builder.mutation<void, TVSpecs>({
      query: (body) => ({
        url: `inventory/tv-specification/`,
        method: "POST",
        body,
      }),
    }),
    createLaptopSpecs: builder.mutation<void, LaptopSpecs>({
      query: (body) => ({
        url: `inventory/laptop-specification/`,
        method: "POST",
        body,
      }),
    }),
    createRouterSpecs: builder.mutation<void, RouterSpecs>({
      query: (body) => ({
        url: `inventory/router-specification/`,
        method: "POST",
        body,
      }),
    }),

    // FIXED: Bulk create equipment with proper invalidation
    bulkCreateEquipment: builder.mutation({
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
            { type: "EquipmentByRoom", id: args.room_id },
            { type: "EquipmentTypesRoom", id: args.room_id }
          );
        }

        return tags;
      },
    }),

    bulkUpdateInn: builder.mutation<
      void,
      { equipments: { id: number; inn: number }[] }
    >({
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
      void,
      { equipmentId: number; status: string }
    >({
      query: ({ equipmentId, status }) => ({
        url: `/inventory/equipment/${equipmentId}/`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { equipmentId }) => [
        { type: "Equipment", id: equipmentId },
        { type: "Equipment", id: "LIST" },
        { type: "Equipment", id: "MY_LIST" },
      ],
    }),

    bulkUpdateEquipmentStatuses: builder.mutation<
      void,
      { updates: { id: number; status: string }[] }
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

    moveEquipments: builder.mutation<
      void,
      { equipment_ids: number[]; to_room_id: number; from_room_id: number }
    >({
      query: (body) => ({
        url: `inventory/equipment/move-equipment/`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { to_room_id, from_room_id }) => [
        { type: "Equipment", id: "LIST" },
        { type: "EquipmentByRoom", id: to_room_id },
        { type: "EquipmentByRoom", id: from_room_id },
        { type: "EquipmentTypesRoom", id: to_room_id },
        { type: "EquipmentTypesRoom", id: from_room_id },
      ],
    }),

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
  }),
});

export const {
  useGetUniversitiesQuery,
  useGetBlocksQuery,
  useGetFloorsQuery,
  useGetFacultiesQuery,
  useGetRoomsQuery,
  useGetEquipmentByRoomQuery,
  useGetEquipmentTypesQuery,
  useGetSpecComputerQuery,
  useBulkCreateEquipmentMutation,
  useBulkUpdateInnMutation,
  useGetEquipmentsQuery,
  useGetSpecProjectorQuery,
  useGetEquipmentsTypesRoomQuery,
  useMoveEquipmentsMutation,
  useDeleteEquipmentsMutation,
  useGetPrinterSpecsQuery,
  useGetMonoblokSpecsQuery,
  useGetElectronicBoardSpecsQuery,
  useGetTvSpecsQuery,
  useGetLaptopSpecsQuery,
  useGetRouterSpecsQuery,
  useCreateSpecComputerMutation,
  useCreateElectronicBoardSpecsMutation,
  useCreateLaptopSpecsMutation,
  useCreateMonoblokSpecsMutation,
  useCreatePrinterSpecsMutation,
  useCreateRouterSpecsMutation,
  useCreateSpecProjectorMutation,
  useCreateTvSpecsMutation,
  useGetAddedEquipmentsQuery,
  useUpdateEquipmentStatusMutation,
  useBulkUpdateEquipmentStatusesMutation,
} = universityApi;
