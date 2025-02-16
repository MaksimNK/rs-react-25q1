import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IItem } from '../utils/api';

export interface SelectedItemState {
  items: IItem[];
}

const initialState: SelectedItemState = {
  items: [],
};

const selectedItemSlice = createSlice({
  name: 'selectedItem',
  initialState,
  reducers: {
    selectItem(state, action: PayloadAction<IItem>) {
      if (!state.items.find((item) => item.url === action.payload.url)) {
        state.items.push(action.payload);
      }
    },
    unSelectItem(state, action: PayloadAction<IItem>) {
      if (state.items.find((item) => item.url === action.payload.url)) {
        state.items = state.items.filter(
          (item) => item.url !== action.payload.url
        );
      }
    },
    unSelectAll(state) {
      state.items = [];
    },
  },
});

export const { selectItem, unSelectItem, unSelectAll } =
  selectedItemSlice.actions;
export default selectedItemSlice.reducer;
