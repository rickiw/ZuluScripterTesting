import Roact from "@rbxts/roact";
import { SCPScrollingFrame } from "client/ui/components/scp";
import { useRem } from "client/ui/hooks";
import { Group } from "client/ui/library/group";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { ColorSelector } from "./color-selector";

export function CustomizeCharacterPage() {
	const rem = useRem();

	return (
		<SCPScrollingFrame
			size={UDim2.fromScale(1, 1)}
			backgroundTransparency={1}
			automaticCanvasSizing={"Y"}
			canvasSize={UDim2.fromScale(1, 0)}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				SortOrder={"LayoutOrder"}
				Padding={new UDim(0, rem(2))}
			/>
			<uipadding
				PaddingTop={new UDim(0, rem(1))}
				PaddingLeft={new UDim(0, rem(1))}
				PaddingRight={new UDim(0, rem(1))}
				PaddingBottom={new UDim(0, rem(1))}
			/>
			<Group autoSize={Enum.AutomaticSize.Y} size={new UDim2(1, 0, 0, 0)} layoutOrder={1}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					SortOrder={"LayoutOrder"}
					Padding={new UDim(0, rem(1))}
				/>
				<Text
					layoutOrder={1}
					textAutoResize="XY"
					font={fonts.inter.extra}
					textColor={palette.subtext1}
					textSize={rem(1)}
					text="SKIN COLOR"
				/>
				<Group autoSize={Enum.AutomaticSize.Y} size={new UDim2(1, 0, 0, 0)} layoutOrder={2}>
					<uipadding PaddingTop={new UDim(0, rem(0.5))} />
					<uigridlayout
						CellSize={UDim2.fromOffset(rem(6), rem(6))}
						VerticalAlignment="Top"
						HorizontalAlignment="Left"
						CellPadding={UDim2.fromOffset(rem(1), rem(1))}
					/>
					<ColorSelector color={Color3.fromHex("#C69C6D")} layoutOrder={1} />
					<ColorSelector color={Color3.fromHex("#A67C52")} layoutOrder={2} />
					<ColorSelector color={Color3.fromHex("#8C6239")} layoutOrder={3} />
					<ColorSelector color={Color3.fromHex("#754C24")} layoutOrder={4} />
					<ColorSelector color={Color3.fromHex("#C7B299")} layoutOrder={5} />
					<ColorSelector color={Color3.fromHex("#534741")} layoutOrder={6} />
					<ColorSelector color={Color3.fromHex("#603813")} layoutOrder={7} />
					<ColorSelector color={Color3.fromHex("#42210B")} layoutOrder={8} />
				</Group>
			</Group>
			<Group autoSize={Enum.AutomaticSize.Y} size={new UDim2(1, 0, 0, 0)} layoutOrder={2}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					SortOrder={"LayoutOrder"}
					Padding={new UDim(0, rem(1))}
				/>
				<Text
					layoutOrder={1}
					textAutoResize="XY"
					font={fonts.inter.extra}
					textColor={palette.subtext1}
					textSize={rem(1)}
					text="FACE"
				/>
				<Group autoSize={Enum.AutomaticSize.Y} size={new UDim2(1, 0, 0, 0)} layoutOrder={2}>
					<uipadding PaddingTop={new UDim(0, rem(0.5))} />
					<uigridlayout
						CellSize={UDim2.fromOffset(rem(6), rem(6))}
						VerticalAlignment="Top"
						HorizontalAlignment="Left"
						CellPadding={UDim2.fromOffset(rem(1), rem(1))}
					/>
					<ColorSelector color={Color3.fromHex("#C69C6D")} layoutOrder={1} />
					<ColorSelector color={Color3.fromHex("#A67C52")} layoutOrder={2} />
					<ColorSelector color={Color3.fromHex("#8C6239")} layoutOrder={3} />
					<ColorSelector color={Color3.fromHex("#754C24")} layoutOrder={4} />
					<ColorSelector color={Color3.fromHex("#C7B299")} layoutOrder={5} />
					<ColorSelector color={Color3.fromHex("#534741")} layoutOrder={6} />
					<ColorSelector color={Color3.fromHex("#603813")} layoutOrder={7} />
					<ColorSelector color={Color3.fromHex("#42210B")} layoutOrder={8} />
				</Group>
			</Group>
			<Group autoSize={Enum.AutomaticSize.Y} size={new UDim2(1, 0, 0, 0)} layoutOrder={3}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					SortOrder={"LayoutOrder"}
					Padding={new UDim(0, rem(1))}
				/>
				<Text
					layoutOrder={1}
					textAutoResize="XY"
					font={fonts.inter.extra}
					textColor={palette.subtext1}
					textSize={rem(1)}
					text="HAIR"
				/>
				<Group autoSize={Enum.AutomaticSize.Y} size={new UDim2(1, 0, 0, 0)} layoutOrder={2}>
					<uipadding PaddingTop={new UDim(0, rem(0.5))} />
					<uigridlayout
						CellSize={UDim2.fromOffset(rem(6), rem(6))}
						VerticalAlignment="Top"
						HorizontalAlignment="Left"
						CellPadding={UDim2.fromOffset(rem(1), rem(1))}
					/>
					<ColorSelector color={Color3.fromHex("#C69C6D")} layoutOrder={1} />
					<ColorSelector color={Color3.fromHex("#A67C52")} layoutOrder={2} />
					<ColorSelector color={Color3.fromHex("#8C6239")} layoutOrder={3} />
					<ColorSelector color={Color3.fromHex("#754C24")} layoutOrder={4} />
					<ColorSelector color={Color3.fromHex("#C7B299")} layoutOrder={5} />
					<ColorSelector color={Color3.fromHex("#534741")} layoutOrder={6} />
					<ColorSelector color={Color3.fromHex("#603813")} layoutOrder={7} />
					<ColorSelector color={Color3.fromHex("#42210B")} layoutOrder={8} />
				</Group>
			</Group>
		</SCPScrollingFrame>
	);
}
