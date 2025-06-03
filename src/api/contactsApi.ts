import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Contracts {
  id: number;
  number: number;
  file: string;
  file_url: string;
  created_at: string;
  valid_until: string;
  author: number;
}

export interface ContractsResponse {
  count: number;
  next: number;
  previous: number;
  results: Contracts[];
}

export const contractApi = createApi({
  reducerPath: "contractApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://invenmaster.pythonanywhere.com/inventory/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Contract"],
  endpoints: (builder) => ({
    getAllContracts: builder.query<ContractsResponse, void>({
      query: () => "contracts/",
      providesTags: ["Contract"],
    }),
    getContracts: builder.query<
      ContractsResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => `contracts?page=${page}&limit=${limit}`,
      providesTags: ["Contract"],
    }),
    createContract: builder.mutation<Contracts, FormData>({
      query: (formData) => ({
        url: "contracts/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Contract"],
    }),
    updateContract: builder.mutation<Contracts, { id: number; data: FormData }>(
      {
        query: ({ id, data }) => ({
          url: `contracts/${id}/`,
          method: "PUT",
          body: data,
        }),
        invalidatesTags: ["Contract"],
      }
    ),
    deleteContract: builder.mutation<void, number>({
      query: (id) => ({
        url: `contracts/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Contract"],
    }),
  }),
});

export const {
  useGetContractsQuery,
  useCreateContractMutation,
  useGetAllContractsQuery,
  useUpdateContractMutation,
  useDeleteContractMutation,
} = contractApi;
