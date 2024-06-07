import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { clientStore } from "client/store";
import { RootProvider } from "client/ui/providers/root-provider";
import { Button } from "../library/button/button";
import { RadioProvider } from "../providers/radio-provider";

const controls = {
	isOpen: true,
};

const Story: WithControls<typeof controls> = {
	summary: "Radio",
	story: (props) => {
		const lastPush = tick();
		clientStore.setRadioOpen(props.controls.isOpen);
		clientStore.setRadioChannels(["PRIMARY", "SECONDARY"]);
		clientStore.setRadioChannelMessages("PRIMARY", [
			{
				user: "Player1",
				text: "Hello, World!",
			},
			{
				user: "Player2",
				text: "Hi!",
			},
			{
				user: "Player2",
				text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Make a very long message to test the text wrapping. This should be long enough to wrap around the text box.",
			},
			{
				user: "Player1",
				text: "Hello, World!",
			},
			{
				user: "Player2",
				text: "Hi!",
			},
			{
				user: "Player2",
				text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Make a very long message to test the text wrapping. This should be long enough to wrap around the text box.",
			},
		]);
		return (
			<RootProvider>
				<Button
					size={new UDim2(0, 100, 0, 50)}
					position={new UDim2(0.5, 0, 0, 0)}
					text="Add message"
					onClick={() => {
						print("Adding message");
						clientStore.addRadioMessage("PRIMARY", {
							user: "Player1",
							text: `Hello, World! ${tick() - lastPush}`,
						});
					}}
				></Button>
				<RadioProvider />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls,
};
export = Story;
