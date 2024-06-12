import { createProducer } from "@rbxts/reflex";

export type RadioMessage = { user: string; color?: Color3; text: string };

export interface CookingState {
	isOpen: boolean;
	messages: {
		[key: string]: RadioMessage[];
	};
	currentMessage: string;
	currentChannel: string;
	channels: string[];
}

const initialState: CookingState = {
	isOpen: false,
	messages: {},
	currentMessage: "",
	currentChannel: "",
	channels: [],
};

export const radioSlice = createProducer(initialState, {
	setRadioOpen: (state, isOpen: boolean) => ({ ...state, isOpen }),
	clearCurrentRadioMessage: (state) => ({ ...state, currentMessage: "" }),
	setRadioCurrentMessage: (state, currentMessage: string) => ({ ...state, currentMessage }),
	setRadioCurrentChannel: (state, currentChannel: string) => ({ ...state, currentChannel }),
	setRadioChannels: (state, channels: string[]) => ({ ...state, channels, currentChannel: channels[0] }),
	addRadioMessage: (state, channel: string, message: RadioMessage) => {
		const messages = { ...state.messages };
		if (!messages[channel]) {
			messages[channel] = [];
		}
		messages[channel] = [...messages[channel], message];
		return { ...state, messages };
	},
	clearAllRadioMessages: (state) => ({ ...state, messages: {} }),
	clearRadioChannelMessages: (state, channel: string) => {
		const messages = { ...state.messages };
		messages[channel] = [];
		return { ...state, messages };
	},
	setRadioChannelMessages: (state, channel: string, messages: RadioMessage[]) => {
		const newMessages = { ...state.messages };
		newMessages[channel] = messages;
		return { ...state, messages: newMessages };
	},
});
