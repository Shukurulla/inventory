import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type LoginState = {
    accessToken: string | null;
    refreshToken: string | null;
};

const initialState: LoginState = {
    accessToken: null,
    refreshToken: null,
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        clearTokens: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
        },
    },
});

export const { setTokens, clearTokens } = loginSlice.actions;
export default loginSlice.reducer;
