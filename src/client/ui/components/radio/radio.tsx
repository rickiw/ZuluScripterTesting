import { useEventListener } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useMemo, useRef, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { useMotion, useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame } from "client/ui/library/frame";
import { Group } from "client/ui/library/group";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { springs } from "shared/constants/springs";

interface RadioBoxProps {
	channels: string[];
	currentChannel: string;
	isOpen: boolean;
	onChannelSelect: (channel: string) => void;
	onTextSubmit: (text: string) => void;
	onTextChange: (text: string) => void;
	messages: { user: string; color?: Color3; text: string }[];
}

const ChannelSelection = (props: {
	position: UDim2;
	channels: string[];
	currentChannel: string;
	onChannelSelect: (channel: string) => void;
}) => {
	const rem = useRem();
	return (
		<Group size={new UDim2(1, 0, 0, rem(1.5))} position={props.position}>
			<uilistlayout
				FillDirection={Enum.FillDirection.Horizontal}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			{props.channels.map((channel, index) => (
				<Button
					size={new UDim2(0, rem(10), 0, rem(1.5))}
					position={UDim2.fromOffset(0, rem(4.4))}
					backgroundColor={channel === props.currentChannel ? palette.active1 : palette.surface1}
					backgroundTransparency={0}
					onClick={() => props.onChannelSelect(channel)}
				>
					<Text
						size={UDim2.fromScale(0.75, 1)}
						position={UDim2.fromScale(0.15, 0)}
						text={channel.upper()}
						textSize={rem(1.25)}
						textXAlignment="Left"
						textColor={palette.overlay1}
						font={fonts.robotoMono.regular}
						textTransparency={0}
					/>
					<Text
						size={UDim2.fromScale(0.2, 1)}
						position={UDim2.fromScale(0.75, 0)}
						text={string.format("%02d", index + 1)}
						textXAlignment="Right"
						textSize={rem(1.25)}
						textColor={palette.overlay1}
						borderSize={0}
						zIndex={3}
						font={fonts.robotoMono.regular}
						textTransparency={0}
					/>
				</Button>
			))}
		</Group>
	);
};

export const RadioBox = (props: RadioBoxProps) => {
	const rem = useRem();
	const ref = useRef<TextLabel>();
	const scrollFrameRef = useRef<ScrollingFrame>();
	const { channels, currentChannel, onChannelSelect, onTextSubmit, messages, isOpen } = props;
	const [stickToBottom, setStickToBottom] = useState(true);
	const [hasFocus, setHasFocus] = useState(false);
	const [canvasSize, setCanvasSize] = useState(0);
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion(1);
	const [canvasPos, setCanvasPos] = useState(new Vector2(0, 0));
	const currentMessages = useMemo(() => {
		return messages
			.map(
				({ user, text, color }) =>
					`<font color="#${(color ?? palette.white).ToHex().upper()}">${user}</font>: ${text}`,
			)
			.join("\n");
	}, [messages]);
	useEffect(() => {
		backgroundTransparencyMotion.spring(isOpen ? 0.25 : 1, springs.gentle);
	}, [isOpen]);

	useEffect(() => {
		if (scrollFrameRef.current !== undefined) {
			setStickToBottom(true);
			const currentCanvasSize = scrollFrameRef.current.CanvasSize.Y.Offset;
			setCanvasSize(currentCanvasSize);
		}
	}, [messages, scrollFrameRef.current]);

	useEventListener(RunService.Heartbeat, () => {
		if (scrollFrameRef.current === undefined || ref.current === undefined) {
			return;
		}
		const currentCanvasSize = scrollFrameRef.current.CanvasSize.Y.Offset;
		const currentCanvasPosition = scrollFrameRef.current.CanvasPosition.Y;
		const currentCanvasAbsoluteSize = scrollFrameRef.current.AbsoluteSize.Y;
		if (currentCanvasSize !== canvasSize) {
			scrollFrameRef.current.CanvasPosition = new Vector2(0, currentCanvasSize - currentCanvasAbsoluteSize);
			setCanvasSize(currentCanvasSize);
			print("Setting scroll");
		}
		const scrollBarOnBottom = currentCanvasSize >= currentCanvasSize - scrollFrameRef.current.AbsoluteSize.Y;
	});

	return (
		<Frame
			size={UDim2.fromOffset(rem(40), rem(20))}
			position={new UDim2(0, 0, 1, 0)}
			anchorPoint={new Vector2(0, 1)}
			backgroundColor={palette.surface0}
			clipsDescendants={true}
			backgroundTransparency={backgroundTransparency}
		>
			<uicorner CornerRadius={new UDim(0, rem(1))} />
			<Frame
				size={UDim2.fromOffset(rem(40), rem(1.75))}
				anchorPoint={new Vector2(0, 0)}
				position={new UDim2(0, 0, 0, rem(1))}
				backgroundTransparency={0}
				backgroundColor={palette.surface1}
			/>
			<Frame
				size={UDim2.fromOffset(rem(40), rem(2.75))}
				backgroundTransparency={0}
				backgroundColor={palette.surface1}
			>
				<uicorner CornerRadius={new UDim(0, rem(1))} />
				<Text
					position={UDim2.fromOffset(rem(0.5), rem(0.25))}
					size={new UDim2(0, rem(17), 0, rem(1.5))}
					textSize={rem(1.5)}
					textXAlignment="Left"
					textTruncate="AtEnd"
					textYAlignment="Bottom"
					text={"RADIO"}
					textColor={palette.white}
					font={fonts.inter.bold}
					textTransparency={backgroundTransparency}
				></Text>
				<Text
					position={UDim2.fromOffset(rem(0.5), rem(1.5))}
					size={new UDim2(0, rem(17), 0, rem(1.25))}
					textSize={rem(1.25)}
					textTruncate="AtEnd"
					text={"COMMUNICATIONS"}
					textColor={palette.subtext0}
					textTransparency={backgroundTransparency}
					textXAlignment="Left"
					textYAlignment="Top"
					font={fonts.inter.regular}
				></Text>
				<Image
					image={images.ui.icons.notification}
					imageTransparency={backgroundTransparency}
					size={new UDim2(0, rem(2.5), 0, rem(2.5))}
					position={new UDim2(0, rem(38), 0, rem(0.125))}
					anchorPoint={new Vector2(0.5, 0)}
					backgroundTransparency={1}
				/>
			</Frame>
			<Image
				size={new UDim2(1, 0, 0, rem(0.2))}
				position={UDim2.fromOffset(rem(0), rem(2.75))}
				anchorPoint={new Vector2(0, 0.5)}
				imageTransparency={backgroundTransparency}
				image={images.ui.misc.divider}
			/>
			<scrollingframe
				ref={scrollFrameRef}
				ScrollingDirection={Enum.ScrollingDirection.Y}
				BackgroundTransparency={1}
				AutomaticSize={Enum.AutomaticSize.None}
				AutomaticCanvasSize={Enum.AutomaticSize.Y}
				TopImage={images.ui.icons.scrollbartop}
				MidImage={images.ui.icons.scrollbarmid}
				BottomImage={images.ui.icons.scrollbarbot}
				ScrollBarImageColor3={palette.white}
				Position={UDim2.fromOffset(rem(0.5), rem(4.2))}
				Size={new UDim2(0, rem(39.5), 0, rem(13))}
				CanvasSize={new UDim2(0, rem(39.5), 0, rem(14.5))}
				CanvasPosition={canvasPos}
			>
				<textlabel
					BackgroundTransparency={1}
					RichText={true}
					FontFace={fonts.arimo.regular}
					Text={currentMessages}
					TextSize={rem(1.5)}
					AutomaticSize={Enum.AutomaticSize.Y}
					TextWrapped={true}
					Selectable={true}
					TextXAlignment={"Left"}
					TextYAlignment={"Top"}
					TextColor3={palette.white}
					Size={new UDim2(0, rem(38), 0, 0)}
					ref={ref}
				/>
			</scrollingframe>
			<Frame
				size={UDim2.fromOffset(rem(40), rem(2.5))}
				anchorPoint={new Vector2(0, 1)}
				position={new UDim2(0, 0, 1, 0)}
				backgroundTransparency={0}
				backgroundColor={palette.surface1}
			>
				<textbox
					PlaceholderText={"Type a message..."}
					PlaceholderColor3={palette.subtext1}
					TextColor3={palette.white}
					TextSize={rem(1)}
					ClearTextOnFocus={false}
					TextXAlignment={"Left"}
					TextYAlignment={"Center"}
					TextWrapped={false}
					TextScaled={false}
					Position={UDim2.fromOffset(rem(0.5), 0)}
					Size={new UDim2(1, -rem(6), 1, 0)}
					Text={""}
					BackgroundTransparency={1}
					Event={{
						FocusLost: (input, enterPressed) => {
							setHasFocus(false);
							if (enterPressed) {
								onTextSubmit(input.Text);
								input.Text = "";
							}
						},
						Focused: (focus) => {
							setHasFocus(true);
						},
						ReturnPressedFromOnScreenKeyboard: (input) => {
							onTextSubmit(input.Text);
							input.Text = "";
						},
					}}
				/>
				<Button size={new UDim2(0, rem(6), 1, 0)} position={new UDim2(1, -rem(6), 0, 0)} text="SEND" />
			</Frame>
			<ChannelSelection
				channels={channels}
				currentChannel={currentChannel}
				onChannelSelect={onChannelSelect}
				position={new UDim2(0, 0, 0, rem(2.85))}
			/>
		</Frame>
	);
};
