import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface Interact {
  totalInteractions: number,
  lastInteractDate: string | null
}

interface InteractState {
  interacts: Array<Interact>
}

const initialState: InteractState = {
  interacts: Array<Interact>(10).fill({ 
    totalInteractions: 0, 
    lastInteractDate: null
  })
};

const interactSlice = createSlice({
  name: "agentInteracts",
  initialState,
  reducers: {
    increaseInteract: (state, action: PayloadAction<{index: number, date: string}>) => {
      state.interacts[action.payload.index].totalInteractions ++;
      state.interacts[action.payload.index].lastInteractDate = action.payload.date;
    },
  },
});

export const { increaseInteract } = interactSlice.actions;
export default interactSlice.reducer;
