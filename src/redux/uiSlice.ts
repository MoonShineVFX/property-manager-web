import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


export interface UIState {
  scanCode?: string;
  isFirst: boolean;
}

const initialState: UIState = {
  isFirst: true
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setScanCode: (state, action: PayloadAction<string>) => {
      state.isFirst = false;
      state.scanCode = action.payload;
    }
  }
})

export const { setScanCode } = uiSlice.actions;
export default uiSlice.reducer;
