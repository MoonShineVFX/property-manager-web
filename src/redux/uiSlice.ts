import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DropdownMenuData } from '../components/DropdownMenu';


export interface EditItemResult {
  state: 'SUCCESS' | 'ERROR' | 'LOADING';
  sn: string;
}

export interface UIState {
  infoSn?: string;
  isSlideActive: boolean;
  selectedTeam?: DropdownMenuData;
  selectedMember?: DropdownMenuData;
  editItemResultList: EditItemResult[]
}

const initialState: UIState = {
  isSlideActive: false,
  editItemResultList: []
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
      state.editItemResultList = []; // Maybe not suitable?
    },
    setInfoSn: (state, action: PayloadAction<string | undefined>) => {
      state.infoSn = action.payload;
    },
    addEditItemResult: (state, action: PayloadAction<EditItemResult>) => {
      state.editItemResultList = [...state.editItemResultList, action.payload];
    },
    updateLastEditItemResult: (state, action: PayloadAction<EditItemResult['state']>) => {
      state.editItemResultList = state.editItemResultList.map((editItemResult, idx, editItemResultList) => {
        if (idx + 1 !== editItemResultList.length) return editItemResult;
        return {...editItemResult, state: action.payload};
      })
    }
  }
})

export const { toggleSlide, setSelectedTeam, setSelectedMember, setInfoSn, addEditItemResult, updateLastEditItemResult } = uiSlice.actions;
export default uiSlice.reducer;
