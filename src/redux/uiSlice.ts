import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DropdownMenuData } from '../components/DropdownMenu'
import { api, Member } from "./api"


export type EditItemResult = {
  state: 'SUCCESS' | 'ERROR' | 'LOADING';
  sn: string;
}

export type NotificationPackage = {
  message: string,
  isSuccess: boolean
};

export type UIState = {
  infoSn?: string;
  cloneMembersData?: DropdownMenuData[];
  selectedTeam?: DropdownMenuData;
  selectedMember?: DropdownMenuData;
  editItemResultList: EditItemResult[];
  notifications: NotificationPackage[];
}

const initialState: UIState = {
  editItemResultList: [],
  notifications: []
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
      state.selectedTeam = action.payload
    },
    setSelectedMember: (state, action: PayloadAction<DropdownMenuData>) => {
      state.selectedMember = action.payload
      state.editItemResultList = [] // Maybe not suitable?
    },
    setInfoSn: (state, action: PayloadAction<string | undefined>) => {
      state.infoSn = action.payload
    },
    showError: (state, action: PayloadAction<string>) => {
      state.notifications.push({isSuccess: false, message: action.payload})
    },
    showInfo: (state, action: PayloadAction<string>) => {
      state.notifications.push({isSuccess: true, message: action.payload})
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
          if (action.meta.arg.originalArgs.note) return
          state.editItemResultList = [...state.editItemResultList, {
            state: 'LOADING',
            sn: action.meta.arg.originalArgs.sn
          }]
        }
      )
      .addMatcher(
        api.endpoints.editItemInfo.matchRejected,
        (state, action) => {
          if (action.meta.arg.originalArgs.note !== undefined) {
            state.notifications.push({isSuccess: false, message: '編輯失敗'})
            return
          }
          state.editItemResultList = state.editItemResultList.map((editItemResult, idx, editItemResultList) => {
            if (idx + 1 !== editItemResultList.length) return editItemResult
            return {...editItemResult, state: 'ERROR'}
          })
        }
      )
      .addMatcher(
        api.endpoints.editItemInfo.matchFulfilled,
        (state, action) => {
          if (action.meta.arg.originalArgs.note != undefined) {
            state.notifications.push({isSuccess: false, message: '編輯成功'})
            return
          }
          state.editItemResultList = state.editItemResultList.map((editItemResult, idx, editItemResultList) => {
            if (idx + 1 !== editItemResultList.length) return editItemResult
            return {...editItemResult, state: 'SUCCESS'}
          })
        }
      );
  }
})


export const {setSelectedTeam, setSelectedMember, setInfoSn, showInfo, showError} = uiSlice.actions
export default uiSlice.reducer;
