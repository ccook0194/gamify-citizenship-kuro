import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import activityReducer from "./slices/activitySlice";
import interactReducer from "./slices/interactionSlice";

export const store = configureStore({
  reducer: {
    agentActivity: activityReducer,
    agentInteracts: interactReducer
  },
});

// Types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hook to use dispatch with correct types
export const useAppDispatch = () => useDispatch<AppDispatch>();