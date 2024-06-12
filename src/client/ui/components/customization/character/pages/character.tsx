import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import {
	FaceOptions,
	HairOptions,
	selectCharacterFace,
	selectCharacterHair,
	selectCharacterSkinColor,
} from "client/store/customization";
import { SCPScrollingFrame } from "client/ui/components/scp";
import { useRem } from "client/ui/hooks";
import { Group } from "client/ui/library/group";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { OptionSelector } from "./option-selector";

const skinColors = [
	Color3.fromHex("#C69C6D"),
	Color3.fromHex("#A67C52"),
	Color3.fromHex("#8C6239"),
	Color3.fromHex("#754C24"),
	Color3.fromHex("#C7B299"),
	Color3.fromHex("#534741"),
	Color3.fromHex("#603813"),
	Color3.fromHex("#42210B"),
];

export function CustomizeCharacterPage() {
	const rem = useRem();

	const selectedFace = useSelector(selectCharacterFace);
	const selectedHair = useSelector(selectCharacterHair);
	const selectedSkinColor = useSelector(selectCharacterSkinColor);

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
					{skinColors.map((color, index) => (
						<OptionSelector
							color={color}
							selected={selectedSkinColor === color}
							layoutOrder={index}
							clicked={() => {
								clientStore.setCharacterSkinColor(color);
							}}
						/>
					))}
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
					{FaceOptions.map((face, index) => (
						<OptionSelector
							previewImage={`rbxthumb://type=Asset&w=150&h=150&id=${face.assetID}`}
							color={
								selectedFace === face.assetID
									? Color3.fromRGB(210, 210, 210)
									: Color3.fromRGB(33, 38, 41)
							}
							selected={selectedFace === face.assetID}
							layoutOrder={index}
							clicked={() => {
								clientStore.setCharacterFace(face.assetID);
							}}
						/>
					))}
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
					{HairOptions.map((hair, index) => (
						<OptionSelector
							previewImage={`rbxthumb://type=Asset&w=150&h=150&id=${hair.assetID}`}
							color={
								selectedHair.includes(hair.assetID)
									? Color3.fromRGB(210, 210, 210)
									: Color3.fromRGB(33, 38, 41)
							}
							selected={selectedHair.includes(hair.assetID)}
							layoutOrder={index}
							clicked={() => {
								clientStore.setCharacterHair([hair.assetID]);
							}}
						/>
					))}
				</Group>
			</Group>
		</SCPScrollingFrame>
	);
}
