import { createSelector } from "@rbxts/reflex";
import { RootState } from "..";

export const selectRadio = (state: RootState) => state.radio;
export const selectRadioIsOpen = (state: RootState) => state.radio.isOpen;
export const selectRadioCurrentMessage = (state: RootState) => state.radio.currentMessage;
export const selectRadioCurrentChannel = (state: RootState) => state.radio.currentChannel;
export const selectRadioChannels = (state: RootState) => state.radio.channels;
export const selectRadioMessages = (state: RootState) => state.radio.messages;
export const selectCurrentChannelMessages = () =>
	createSelector(
		[selectRadioCurrentChannel, selectRadioMessages],
		(currentChannel, messages) => messages[currentChannel] ?? [],
	);
