import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DropdownMenuData } from '../components/DropdownMenu';


export interface UIState {
  infoScanCode?: string;
  isInfoFirst: boolean;
  isSlideActive: boolean;
  selectedTeam?: DropdownMenuData;
  selectedMember?: DropdownMenuData;
}

const initialState: UIState = {
  isInfoFirst: true,
  isSlideActive: false
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setInfoScanCode: (state, action: PayloadAction<string>) => {
      state.isInfoFirst = false;
      state.infoScanCode = action.payload;
      state.isSlideActive = true;
    },
    disableSlide: (state) => {
      state.isSlideActive = false;
    },
    setSelectedTeam: (state, action: PayloadAction<DropdownMenuData>) => {
      state.selectedTeam = action.payload;
    },
    setSelectedMember: (state, action: PayloadAction<DropdownMenuData>) => {
      state.selectedMember = action.payload;
    }
  }
})

export const { setInfoScanCode, disableSlide, setSelectedTeam, setSelectedMember } = uiSlice.actions;
export default uiSlice.reducer;
