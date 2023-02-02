
import { createSlice } from '@reduxjs/toolkit';


export const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isDateModalOpen: false,
    modalTitle: 'Nuevo'
  },
  reducers: {
    onOpenDateModal: (state, action) => {
      state.modalTitle = action.payload;
      state.isDateModalOpen = true;
    },
    onCloseDateModal: (state) => {
      state.isDateModalOpen = false;
    },
  }
});

export const { onOpenDateModal, onCloseDateModal } = uiSlice.actions;