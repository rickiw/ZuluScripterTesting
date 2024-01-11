import { TouchpadState } from "client/store/touchpad/touchpad-slice";

export const selectTouchpadType = (state: TouchpadState) => state.touchpadType;
export const selectTouchpadActive = (state: TouchpadState) => state.active;
