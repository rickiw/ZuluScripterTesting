import Object from "@rbxts/object-utils";
import Roact from "@rbxts/roact";
import { Outfits } from "client/store/customization";
import { SCPScrollingFrame } from "client/ui/components/scp";
import { useRem } from "client/ui/hooks";
import { UniformSelector } from "../uniform-selector";

export function CustomizeUniformPage() {
	const rem = useRem();

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

			{Object.values(Outfits).map((uniform) => (
				<UniformSelector uniform={uniform} previewImage="shirt" />
			))}
		</SCPScrollingFrame>
	);
}
