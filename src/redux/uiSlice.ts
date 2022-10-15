import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DropdownMenuData } from '../components/DropdownMenu';


export interface UIState {
  isInfoFirst: boolean;
  isEditFirst: boolean;
  isSlideActive: boolean;
  selectedTeam?: DropdownMenuData;
  selectedMember?: DropdownMenuData;
}

const initialState: UIState = {
  isInfoFirst: true,
  isEditFirst: true,
  isSlideActive: false
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSlide: (state, action: PayloadAction<boolean>) => {
      state.isSlideActive = action.payload;
    },
    setSelectedTeam: (state, action: PayloadAction<DropdownMenuData>) => {
      state.selectedTeam = action.payload;
    },
    setSelectedMember: (state, action: PayloadAction<DropdownMenuData>) => {
      state.selectedMember = action.payload;
    },
    disableInfoFirst: (state) => {
      state.isInfoFirst = false;
    },
    disableEditFirst: (state) => {
      state.isEditFirst = false;
    }
  }
})

export const { toggleSlide, setSelectedTeam, setSelectedMember, disableEditFirst, disableInfoFirst } = uiSlice.actions;
export default uiSlice.reducer;
