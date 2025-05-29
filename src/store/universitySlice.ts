import { createSlice, createAction, type PayloadAction } from '@reduxjs/toolkit';

export const setSelected = createAction<{ type: 'block' | 'floor' | 'room'; id: number | null }>(
  'university/setSelected'
);

interface UniversityState {
  selectedBlockId: number | null;
  selectedFloorId: number | null;
  selectedRoomId: number | null;
}

const initialState: UniversityState = {
  selectedBlockId: null,
  selectedFloorId: null,
  selectedRoomId: null,
};

const universitySlice = createSlice({
  name: 'university',
  initialState,
  reducers: {
},
  extraReducers: (builder) => {
    builder.addCase(setSelected, (state, action: PayloadAction<{ type: 'block' | 'floor' | 'room'; id: number | null }>) => {
      const { type, id } = action.payload;
      switch (type) {
        case 'block':
          state.selectedBlockId = id;
          state.selectedFloorId = null;
          state.selectedRoomId = null;
          break;
        case 'floor':
          state.selectedFloorId = id;
          state.selectedRoomId = null;
          break;
        case 'room':
          state.selectedRoomId = id;
          break;
        default:
          break;
      }
    });
  },
});

export default universitySlice.reducer;