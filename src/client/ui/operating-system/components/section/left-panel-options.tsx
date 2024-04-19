import Roact from "@rbxts/roact";
import { usePx } from "client/ui/hooks/use-pix";
import { Frame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
interface titleProps {
	text: string;
	LayoutOrder: number;
}

export function LeftPanelTitle(props: titleProps) {
	const rem = usePx();
	return (
		<Frame
			visible={true}
			key={"Title"}
			backgroundColor={Color3.fromHex("#212629")}
			size={new UDim2(1, 0, 0, rem(30))}
			layoutOrder={props.LayoutOrder}
			borderSize={1}
			borderColor={Color3.fromRGB(60, 65, 70)}
			borderMode={"Inset"}
		>
			<Text
				text={props.text}
				font={fonts.arimo.bold}
				position={UDim2.fromScale(0.025, 0.15)}
				textColor={Color3.fromHex("#474C4F")}
				size={UDim2.fromScale(0.975, 0.75)}
				textXAlignment={"Left"}
				textScaled={true}
			/>
		</Frame>
	);
}

interface headerProps {
	text: string;
}

export function LeftPanelHeader(props: headerProps) {
	const rem = usePx();
	return (
		<Frame
			layoutOrder={0}
			key={"Option-Title"}
			backgroundTransparency={1}
			borderSize={0}
			size={new UDim2(1, 0, 0, rem(30))}
		>
			<Text
				position={UDim2.fromScale(0, 0.15)}
				size={UDim2.fromScale(1, 0.75)}
				font={fonts.arimo.bold}
				textColor={Color3.fromHex("#B0B0B0")}
				textScaled={true}
				textXAlignment={"Left"}
				text={props.text}
			/>
		</Frame>
	);
}

interface textOptionProps {
	text: string;
}
export function LeftPanelTextOption(props: textOptionProps) {
	const rem = usePx();
	return (
		<Frame
			key={"TextOption"}
			backgroundColor={Color3.fromRGB(16, 20, 21)}
			borderSize={1}
			borderColor={Color3.fromRGB(60, 65, 70)}
			size={new UDim2(1, 0, 0, rem(30))}
		>
			<Text
				key={"text-option"}
				position={UDim2.fromScale(0.025, 0.15)}
				size={UDim2.fromScale(0.975, 0.75)}
				font={fonts.arimo.regular}
				textColor={Color3.fromRGB(130, 130, 130)}
				textScaled={true}
				textXAlignment={"Left"}
				text={props.text}
			/>
			<Text
				key={"text-value"}
				position={UDim2.fromScale(0, 0.15)}
				size={UDim2.fromScale(0.95, 0.75)}
				font={fonts.arimo.regular}
				textColor={Color3.fromRGB(130, 130, 130)}
				textScaled={true}
				textXAlignment={"Right"}
				text={props.text}
			/>
		</Frame>
	);
}

export function LeftPanelOptionRadialButton() {
	const rem = usePx();

	return (
		<Frame
			visible={true}
			key={"Panel"}
			backgroundColor={Color3.fromRGB(16, 20, 21)}
			borderSize={1}
			borderColor={Color3.fromRGB(60, 65, 70)}
			position={UDim2.fromScale(0, 0)}
			size={new UDim2(1, 0, 0, rem(30))}
		>
			<uilistlayout />
		</Frame>
	);
}
