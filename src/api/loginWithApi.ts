import { createApi} from '@reduxjs/toolkit/query/react';
import type { LoginRequest, LoginResponse } from '../types';
import { baseQueryWithReauth } from './Auth/BaseQueryWithReauth';

const LoginUser = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        loginUser: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: 'user/login/',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_args, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data?.access) {
                        localStorage.setItem('accessToken', data.access);
                    }
                    if (data?.refresh) {
                        localStorage.setItem('refreshToken', data.refresh);
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),      
        refreshToken: builder.mutation<{ access: string }, { refresh: string }>({
            query: (data) => ({
                url: "/api/token/refresh/",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { useLoginUserMutation, useRefreshTokenMutation } = LoginUser;
export default LoginUser;
