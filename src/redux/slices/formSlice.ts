import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  uncontrolledFormData: Record<string, unknown> | null;
  hookFormData: Record<string, unknown> | null;
  newDataSource: string | null;
}

const initialState: FormState = {
  uncontrolledFormData: null,
  hookFormData: null,
  newDataSource: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    saveUncontrolledFormData(
      state,
      action: PayloadAction<Record<string, unknown>>
    ) {
      state.uncontrolledFormData = action.payload;
      state.newDataSource = 'uncontrolled';
    },
    saveHookFormData(state, action: PayloadAction<Record<string, unknown>>) {
      state.hookFormData = action.payload;
      state.newDataSource = 'hookForm';
    },
    clearNewDataFlag: (state) => {
      state.newDataSource = null;
    },
  },
});
export const { saveUncontrolledFormData, saveHookFormData, clearNewDataFlag } =
  formSlice.actions;
export default formSlice.reducer;
