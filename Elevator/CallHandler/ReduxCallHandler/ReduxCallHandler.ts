import { ConvoyMessage, MessageStatus, QueuedMessage } from "../../Domain";
import { CallHandler } from "../CallHandler";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { actions as callsActions, reducer as callsReducer } from "./callsSlice";

const { addCall, setStatus } = callsActions;

export class ReduxCallHandler implements CallHandler {
  private readonly store;
  constructor() {
    this.store = configureStore({
      reducer: {
        calls: callsReducer,
      },
    });
  }

  public subscribe(listener: () => void): () => void {
    return this.store.subscribe(listener);
  }

  public getQueue() {
    return this.store.getState().calls;
  }

  saveMessageToQueue(message: ConvoyMessage): void {
    console.warn(message);
    this.store.dispatch(addCall(message));
  }

  setStatus(messageId: number, status: MessageStatus): void {
    this.store.dispatch(setStatus({ id: messageId, status }));
  }
}
