import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { selectMenuOpen, selectMenuPage, selectMenuPanel } from "client/store/menu";
import { useRem } from "client/ui/hooks";
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
	const rem = useRem();

	const currentPage = useSelector(selectMenuPage);
	const adornee = useSelector(selectMenuPanel);
	const menuOpen = useSelector(selectMenuOpen);

	return (
		<SurfaceLayer
			alwaysOnTop={true}
			face={Enum.NormalId.Front}
			adornee={adornee}
			sizingMode={Enum.SurfaceGuiSizingMode.FixedSize}
			canvasSize={new Vector2(2440, 1080)}
			enabled={menuOpen}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				backgroundTransparency={0.7}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				position={UDim2.fromScale(0.5, 0.5)}
				size={UDim2.fromScale(1, 1)}
			>
				<uipadding
					PaddingTop={new UDim(0, rem(1))}
					PaddingBottom={new UDim(0, rem(1))}
					PaddingLeft={new UDim(0, rem(2))}
					PaddingRight={new UDim(0, rem(2))}
				/>
				<Text
					font={fonts.gothic.regular}
					text={player.Name.upper()}
					textSize={rem(2.5)}
					size={new UDim2(0, rem(30), 0, rem(5))}
					textColor={Color3.fromRGB(255, 255, 255)}
				/>
				<ButtonRow />
				<MenuPage menuPage={currentPage} />
			</Frame>
		</SurfaceLayer>
	);
}
