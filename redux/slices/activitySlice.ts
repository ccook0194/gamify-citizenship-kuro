import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import moment from 'moment';
import { dateConvert } from "@/lib/utils";

export const fetchAgentActivity = createAsyncThunk("data/fetchAgentActivity", async (date: Date) => {
  const response = await fetch("/api/activity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      date: moment(dateConvert(date)).format('YYYY-MM-DD'),
      time: moment(date).format("HH:mm")
    }),
  })

  if (!response.ok) throw new Error("Failed to fetch time")

  const data = await response.json()
  console.log(data.data)
  return data.data
});


interface ActivityState {
  agents: Array<object>,
  conversations: object | undefined,
  date: string, 
  time: string,
  world: object | undefined,
  error: string
}

const initialState: ActivityState = {
  agents: new Array(),
  conversations: undefined,
  date: "2023-01-01", 
  time: "6:00",
  world: undefined,
  error: ""
};

const activitySlice = createSlice({
  name: "agentActivity",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgentActivity.pending, (state) => {
      })
      .addCase(fetchAgentActivity.fulfilled, (state, action) => {
        state.agents = action.payload.agents;
        state.conversations = action.payload.conversations;
        state.date = action.payload.date;
        state.time = action.payload.time;
        state.world = action.payload.world;
      })
      .addCase(fetchAgentActivity.rejected, (state, action) => {
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default activitySlice.reducer;
