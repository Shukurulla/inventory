// src/api/userApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./Auth/BaseQueryWithReauth";

export interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  profile_picture: string | null;
  role: string;
  position?: string;
  department?: string;
  date_joined: string;
  last_login?: string;
  is_active: boolean;
}

export interface UserProfileUpdate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string | null;
  position?: string;
  department?: string;
  profile_picture?: File | null;
}

export interface UserStats {
  equipment_added: number;
  contracts_created: number;
  last_login?: string;
  total_actions: number;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["UserProfile", "UserStats"],
  endpoints: (builder) => ({
    // Get current user profile
    getUserProfile: builder.query<UserProfile, void>({
      query: () => "user/profile/",
      providesTags: ["UserProfile"],
    }),

    // Update user profile
    updateUserProfile: builder.mutation<UserProfile, UserProfileUpdate>({
      query: (data) => {
        // FormData yaratish agar file bo'lsa
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (key === "profile_picture" && value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === "object" && !(value instanceof File)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });

        return {
          url: "user/profile/",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["UserProfile"],
    }),

    // Change password
    changePassword: builder.mutation<
      { message: string },
      { old_password: string; new_password: string; confirm_password: string }
    >({
      query: (data) => ({
        url: "user/change-password/",
        method: "POST",
        body: data,
      }),
    }),

    // Get user statistics
    getUserStats: builder.query<UserStats, void>({
      query: () => "user/stats/",
      providesTags: ["UserStats"],
    }),

    // Upload profile picture
    uploadProfilePicture: builder.mutation<UserProfile, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("profile_picture", file);
        return {
          url: "user/profile/picture/",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["UserProfile"],
    }),

    // Delete profile picture
    deleteProfilePicture: builder.mutation<UserProfile, void>({
      query: () => ({
        url: "user/profile/picture/",
        method: "DELETE",
      }),
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useGetUserStatsQuery,
  useUploadProfilePictureMutation,
  useDeleteProfilePictureMutation,
} = userApi;

// Store.ts ga qo'shish uchun export
export default userApi;
