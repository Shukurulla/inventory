import type { ElectronBoardSpecs, EquipmentTypes, LaptopSpecs, MonoblokSpecs, PrinterSpecs, ProjectorSpecs, RouterSpecs, TBlock, TCompSpecifications, Tequipment, TEquipmnetTypesRoom, TFaculty, TFloor, TInventory, TRoom, TUniversity, TVSpecs } from '@/types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const universityApi = createApi({
  reducerPath: 'universityApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://invenmaster.pythonanywhere.com/',
    prepareHeaders: (headers) => {
      const token = localStorage.accessToken
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      headers.delete('Content-Type');
      return headers
    }
  }),
  tagTypes: ["Equipment"],
  endpoints: (builder) => ({
    getUniversities: builder.query<TUniversity[], void>({
      query: () => `university/`,
    }),
    getBlocks: builder.query<TBlock[], {univerId: number}>({
      query: () => `/university/buildings/`,
      transformResponse: (response: TBlock[], _meta, arg) => {
        return response.filter(block => block.university === arg.univerId)
      },
    }),
    getFloors: builder.query<TFloor[], void>({
      query: () => `university/floors/`
    }),
    getFaculties: builder.query<TFaculty[], { buildingId: number; floorId: number }>({
      query: ({ buildingId, floorId }) =>
        `university/faculties/?building_id=${buildingId}&floor_id=${floorId}`,
      transformResponse: (response: TFaculty[], _meta, arg) => {
        return response.filter(faculty =>
          faculty.building === arg.buildingId &&
          faculty.floor === arg.floorId
        )
      },
    }),
    getRooms: builder.query<TRoom[], void>({
      query: () =>
        `/university/rooms/`,
    }),
    getEquipmentByRoom: builder.query<TInventory, { roomId: number; }>({
      query: ({ roomId }) => `inventory/equipment/equipment-by-room/${roomId}/`,
    }),
    getEquipments: builder.query<TInventory, void>({
      query: () => `/inventory/equipment/`
    }),
    getEquipmentsTypesRoom: builder.query<TEquipmnetTypesRoom[], {roomId: number}>({
      query: ({roomId}) => `/inventory/equipment/by-room/${roomId}/data/`
    }),
    getEquipmentTypes: builder.query<EquipmentTypes[], void>({
      query: () => `/inventory/equipment-types/`,
    }),
    getAddedEquipments: builder.query<Tequipment[], void>({
      query: () => `/inventory/equipment/my-equipments/`,
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
        method: 'POST',
        body,
      }),
    }),
    createSpecProjector: builder.mutation<void, ProjectorSpecs>({
      query: (body) => ({
        url: `/inventory/projector-specification/`,
        method: 'POST',
        body,
      }),
    }),
    createPrinterSpecs: builder.mutation<void, PrinterSpecs>({
      query: (body) => ({
        url: `inventory/printer-specification/`,
        method: 'POST',
        body,
      }),
    }),
    createMonoblokSpecs: builder.mutation<void, MonoblokSpecs>({
      query: (body) => ({
        url: `inventory/monoblok-specification/`,
        method: 'POST',
        body,
      }),
    }),
    createElectronicBoardSpecs: builder.mutation<void, ElectronBoardSpecs>({
      query: (body) => ({
        url: `inventory/whiteboard-specification/`,
        method: 'POST',
        body,
      }),
    }),
    createTvSpecs: builder.mutation<void, TVSpecs>({
      query: (body) => ({
        url: `inventory/tv-specification/`,
        method: 'POST',
        body,
      }),
    }),
    createLaptopSpecs: builder.mutation<void, LaptopSpecs>({
      query: (body) => ({
        url: `inventory/laptop-specification/`,
        method: 'POST',
        body,
      }),
    }),
    createRouterSpecs: builder.mutation<void, RouterSpecs>({
      query: (body) => ({
        url: `inventory/router-specification/`,
        method: 'POST',
        body,
      }),
    }),

    bulkCreateEquipment: builder.mutation({
      query: (body) => ({
        url: 'inventory/equipment/bulk-create/',
        method: 'POST',
        body,
      }),
    }),
    bulkUpdateInn: builder.mutation<void, { equipments: { id: number; inn: number }[] }>({
      query: (body) => ({
        url: '/inventory/equipment/bulk-update-inn/',
        method: 'POST',
        body,
      }),
    }),

    // getEquipments: builder.query<TInventory[], { block?: number; room?: number; type?: number }>({
    //   query: (filters) => {
    //     const params = new URLSearchParams();
    //     if (filters.block) params.append("block", filters.block.toString());
    //     if (filters.room) params.append("room", filters.room.toString());
    //     if (filters.type) params.append("type", filters.type.toString());
    //     return `/inventory/equipment/?${params.toString()}`;
    //   },
    //   providesTags: ["Equipment"],
    // }),
    moveEquipments: builder.mutation<void, { equipment_ids: number[]; to_room_id: number, from_room_id: number }>({
      query: (body) => ({
        url: `inventory/equipment/move-equipment/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Equipment"],
    }),
    deleteEquipments: builder.mutation<void, { ids: number[];}>({
      query: (body) => ({
        url: `/inventory/equipment/bulk-delete/`,
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Equipment"],
    }),

  })
})

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
  useGetAddedEquipmentsQuery
} = universityApi;
