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
			sizingMode={Enum.SurfaceGuiSizingMode.PixelsPerStud}
			pixelsPerStud={100}
			enabled={menuOpen}
		>
			<Frame
				backgroundTransparency={0.7}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				size={UDim2.fromOffset(rem(120), rem(52.5))}
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
					position={UDim2.fromOffset(rem(0), rem(1))}
					textColor={Color3.fromRGB(255, 255, 255)}
				/>
				<ButtonRow />
				<MenuPage menuPage={currentPage} />
			</Frame>
		</SurfaceLayer>
	);
}
