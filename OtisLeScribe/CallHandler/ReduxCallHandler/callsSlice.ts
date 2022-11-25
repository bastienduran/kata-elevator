import { createSlice } from "@reduxjs/toolkit";
import { MessageStatus, QueuedMessage } from "../../Domain";

const initialState: QueuedMessage[] = [];

const callsSlice = createSlice({
  name: "calls",
  initialState,
  reducers: {
    addCall(state, action) {
      return [...state, action.payload];
    },
    setStatus(
      state,
      { payload }: { payload: { id: number; status: MessageStatus } }
    ) {
      return state.map((message) => {
        if (message.messageId === payload.id) {
          return { ...message, status: payload.status };
        }
        return message;
      });
    },
  },
});

export const { actions, reducer } = callsSlice;
