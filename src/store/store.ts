// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import LoginUser from "@/api/loginWithApi";
import loginReducer from "./loginSlice";
import { universityApi } from "@/api/universityApi";
import universityReducer from "./universitySlice";
import { contractApi } from "@/api/contactsApi";
import userApi from "@/api/userApi";

export const store = configureStore({
  reducer: {
    [LoginUser.reducerPath]: LoginUser.reducer,
    login: loginReducer,
    university: universityReducer,
    [contractApi.reducerPath]: contractApi.reducer,
    [universityApi.reducerPath]: universityApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      LoginUser.middleware,
      universityApi.middleware,
      contractApi.middleware,
      userApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
