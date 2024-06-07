import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectWeapons } from "client/store/inventory";
import { SCPScrollingFrame } from "client/ui/components/scp";
import { useRem } from "client/ui/hooks";
import { WeaponSelector } from "../weapon-selector";

export function CustomizePrimaryPage() {
	const rem = useRem();

	const allWeapons = useSelector(selectWeapons);

	return (
		<SCPScrollingFrame
			size={UDim2.fromScale(1, 1)}
			backgroundTransparency={1}
			automaticCanvasSizing={"Y"}
			canvasSize={UDim2.fromScale(1, 0)}
		>
			<uipadding PaddingTop={new UDim(0, rem(1))} />
			<uigridlayout
				CellSize={UDim2.fromOffset(rem(16), rem(10))}
				VerticalAlignment="Top"
				HorizontalAlignment="Center"
				CellPadding={UDim2.fromOffset(rem(1), rem(1))}
			/>

			{allWeapons
				.filter((weapon) => weapon.weaponType === "Primary")
				.sort((a, b) => a.baseTool.Name < b.baseTool.Name)
				.map((weapon) => (
					<WeaponSelector weapon={weapon} previewImage="handgun" />
				))}
		</SCPScrollingFrame>
	);
}
