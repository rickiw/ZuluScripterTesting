import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useCallback } from "@rbxts/roact";
import { UserInputService } from "@rbxts/services";
import { clientStore } from "client/store";
import {
	selectCustomizationPage,
	selectSelectedModificationMount,
	selectSelectedWeapon,
	selectWeaponCustomizationPage,
	selectWeaponCustomizationPageSubtitle,
} from "client/store/customization";
import { useRem } from "client/ui/hooks";
import { Group } from "client/ui/library/group";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";

export function WeaponCustomizationFooter() {
	const rem = useRem();

	const subtitle = useSelector(selectWeaponCustomizationPageSubtitle);
	const customizationPage = useSelector(selectCustomizationPage);
	const selectedWeapon = useSelector(selectSelectedWeapon);
	const weaponSelectedPage = useSelector(selectWeaponCustomizationPage);
	const selectedModificationMount = useSelector(selectSelectedModificationMount);

	const advance = useCallback(() => {
		// clientStore.setCustomizationOpen(false);
	}, [customizationPage]);

	const goback = useCallback(() => {
		if (weaponSelectedPage === "mods" && selectedWeapon && selectedModificationMount) {
			clientStore.setSelectedModificationMount(undefined);
			return;
		}
		clientStore.setCustomizationPage("character");
	}, [customizationPage, weaponSelectedPage, selectedWeapon, selectedModificationMount]);

	useEventListener(UserInputService.InputBegan, (input) => {
		if (input.KeyCode === Enum.KeyCode.LeftShift) {
			goback();
		}
		if (input.KeyCode === Enum.KeyCode.Return) {
			advance();
		}
	});

	return (
		<>
			<Image
				size={new UDim2(1, 0, 0, rem(0.2))}
				anchorPoint={new Vector2(0, 0.5)}
				position={new UDim2(0, rem(0), 1, -rem(10))}
				image={images.ui.misc.divider}
			/>
			<Group size={new UDim2(1, 0, 0, rem(10))} position={UDim2.fromScale(0, 1)} anchorPoint={new Vector2(0, 1)}>
				<Text
					position={UDim2.fromOffset(rem(0.25), rem(2))}
					textColor={palette.white}
					textSize={rem(1.25)}
					font={fonts.inter.extra}
					textAutoResize="XY"
					text={subtitle.upper()}
				/>
				<Group
					size={new UDim2(1, -rem(5), 0, rem(4))}
					anchorPoint={new Vector2(0, 1)}
					position={new UDim2(0, rem(2), 1, -rem(1))}
				>
					<textbutton
						BackgroundTransparency={1}
						Text={""}
						AnchorPoint={new Vector2(0, 0.5)}
						Position={new UDim2(0, 0, 0.5, 0)}
						AutomaticSize={Enum.AutomaticSize.X}
						Size={new UDim2(0, rem(8), 1, 0)}
					>
						<uilistlayout
							HorizontalAlignment={"Center"}
							VerticalAlignment={"Center"}
							FillDirection={"Horizontal"}
							SortOrder={"LayoutOrder"}
							Padding={new UDim(0, rem(1))}
						/>
						<textlabel
							LayoutOrder={1}
							Text={"SHFT"}
							TextColor3={palette.white}
							BackgroundTransparency={1}
							FontFace={fonts.arimo.regular}
							TextSize={rem(1)}
							Size={new UDim2(0, rem(3), 0, rem(1.5))}
						>
							<uicorner CornerRadius={new UDim(0, rem(0.25))} />
							<uistroke Color={palette.white} Thickness={1} ApplyStrokeMode={"Border"} />
						</textlabel>
						<Text
							layoutOrder={2}
							text={"BACK"}
							textColor={palette.white}
							font={fonts.arimo.regular}
							textSize={rem(1.25)}
							textAutoResize="XY"
						/>
					</textbutton>
					<textbutton
						BackgroundTransparency={1}
						Text={""}
						AnchorPoint={new Vector2(1, 0.5)}
						Position={new UDim2(1, 0, 0.5, 0)}
						AutomaticSize={Enum.AutomaticSize.X}
						Size={new UDim2(0, rem(8), 1, 0)}
					>
						<uilistlayout
							HorizontalAlignment={"Center"}
							VerticalAlignment={"Center"}
							FillDirection={"Horizontal"}
							SortOrder={"LayoutOrder"}
							Padding={new UDim(0, rem(1))}
						/>
						<textlabel
							LayoutOrder={2}
							Text={"ENTR"}
							TextColor3={palette.white}
							BackgroundTransparency={1}
							FontFace={fonts.arimo.regular}
							TextSize={rem(1)}
							Size={new UDim2(0, rem(3), 0, rem(1.5))}
						>
							<uicorner CornerRadius={new UDim(0, rem(0.25))} />
							<uistroke Color={palette.white} Thickness={1} ApplyStrokeMode={"Border"} />
						</textlabel>
						<Text
							layoutOrder={1}
							text={"CONTINUE"}
							textColor={palette.white}
							font={fonts.arimo.regular}
							textSize={rem(1.25)}
							textAutoResize="XY"
						/>
					</textbutton>
				</Group>
			</Group>
		</>
	);
}
