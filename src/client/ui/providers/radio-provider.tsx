import { useSelector, useSelectorCreator } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import {
	selectCurrentChannelMessages,
	selectRadioChannels,
	selectRadioCurrentChannel,
	selectRadioIsOpen,
} from "client/store/radio";
import { selectCurrentUser } from "client/store/terminal";
import { RadioBox } from "../components/radio";

export function RadioProvider() {
	const isOpen = useSelector(selectRadioIsOpen);
	const currentChannel = useSelector(selectRadioCurrentChannel);
	const channels = useSelector(selectRadioChannels);
	const currentUser = useSelector(selectCurrentUser);
	const messages = useSelectorCreator(selectCurrentChannelMessages);

	return (
		<RadioBox
			isOpen={isOpen}
			currentChannel={currentChannel}
			channels={channels}
			messages={messages}
			onChannelSelect={(channel) => {
				print("Channel selected", channel);
				clientStore.setRadioCurrentChannel(channel);
			}}
			onTextChange={(text) => {
				clientStore.setRadioCurrentMessage(text);
			}}
			onTextSubmit={(text) => {
				// TODO: Add send message logic
				clientStore.addRadioMessage(currentChannel, {
					user: currentUser,
					text,
				});
				clientStore.clearCurrentRadioMessage();
			}}
		/>
	);
}
