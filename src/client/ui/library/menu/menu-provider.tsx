import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { selectMenuPage, selectMenuPanel } from "client/store/menu";
import { fonts } from "shared/constants/fonts";
import { Frame } from "../frame";
import { SurfaceLayer } from "../layer";
import { Text } from "../text";
import { ButtonRow } from "./button-row";
import { MenuPage } from "./pages/page";

interface MenuPage {
	visible: boolean;
	title: string;
}

const player = Players.LocalPlayer;

export function MenuProvider() {
	const currentPage = useSelector(selectMenuPage);
	const adornee = useSelector(selectMenuPanel);

	return (
		<SurfaceLayer
			alwaysOnTop={true}
			face={Enum.NormalId.Front}
			adornee={adornee}
			sizingMode={Enum.SurfaceGuiSizingMode.PixelsPerStud}
			pixelsPerStud={50}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				backgroundTransparency={0.7}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				position={UDim2.fromScale(0.5, 0.5)}
				size={UDim2.fromScale(1, 1)}
			>
				<uipadding PaddingTop={new UDim(0.01, 0)} />
				<Text
					font={fonts.gothic.regular}
					text={player.Name.upper()}
					textScaled={true}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.15, 0.04)}
					size={UDim2.fromScale(0.2, 0.1)}
					textColor={Color3.fromRGB(255, 255, 255)}
				/>
				<ButtonRow />
				<MenuPage menuPage={currentPage} />
			</Frame>
		</SurfaceLayer>
	);
}
