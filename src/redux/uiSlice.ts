import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DropdownMenuData } from '../components/DropdownMenu';
import { api, Member } from "./api";


export interface EditItemResult {
  state: 'SUCCESS' | 'ERROR' | 'LOADING';
  sn: string;
}

export interface UIState {
  infoSn?: string;
  cloneMembersData?: DropdownMenuData[];
  selectedTeam?: DropdownMenuData;
  selectedMember?: DropdownMenuData;
  editItemResultList: EditItemResult[];
}

const initialState: UIState = {
  editItemResultList: []
}

export const applyMember = createAsyncThunk<string, string>(
  'ui/applyMember',
  (oeid: string, thunkAPI) => {
    let foundMemberName = '';
    const {ui: uiState} = thunkAPI.getState() as { ui: UIState };
    uiState.cloneMembersData?.forEach(team => {
      team.value.forEach((member: DropdownMenuData) => {
        if ((member.value as Member).eid === oeid) {
          thunkAPI.dispatch(uiSlice.actions.setSelectedTeam(team));
          thunkAPI.dispatch(uiSlice.actions.setSelectedMember(member));
          foundMemberName = member.name;
        }
      });
    });
    if (foundMemberName) return foundMemberName;
    return thunkAPI.rejectWithValue(foundMemberName);
  }
);

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedTeam: (state, action: PayloadAction<DropdownMenuData>) => {
      state.selectedTeam = action.payload;
    },
    setSelectedMember: (state, action: PayloadAction<DropdownMenuData>) => {
      state.selectedMember = action.payload;
      state.editItemResultList = []; // Maybe not suitable?
    },
    setInfoSn: (state, action: PayloadAction<string | undefined>) => {
      state.infoSn = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        api.endpoints.getMembers.matchFulfilled,
        (state, action) => {
          state.cloneMembersData = action.payload
        }
      )
      .addMatcher(
        api.endpoints.editItemInfo.matchPending,
        (state, action) => {
          state.editItemResultList = [...state.editItemResultList, {
            state: 'LOADING',
            sn: action.meta.arg.originalArgs.sn
          }]
        }
      )
      .addMatcher(
        api.endpoints.editItemInfo.matchRejected,
        (state) => {
          state.editItemResultList = state.editItemResultList.map((editItemResult, idx, editItemResultList) => {
            if (idx + 1 !== editItemResultList.length) return editItemResult;
            return {...editItemResult, state: 'ERROR'};
          })
        }
      )
      .addMatcher(
        api.endpoints.editItemInfo.matchFulfilled,
        (state) => {
          state.editItemResultList = state.editItemResultList.map((editItemResult, idx, editItemResultList) => {
            if (idx + 1 !== editItemResultList.length) return editItemResult;
            return {...editItemResult, state: 'SUCCESS'};
          })
        }
      );
  }
})


export const {setSelectedTeam, setSelectedMember, setInfoSn} = uiSlice.actions;
export default uiSlice.reducer;
