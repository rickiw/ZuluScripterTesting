import Object from "@rbxts/object-utils";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { Outfits } from "client/store/customization";
import { SCPScrollingFrame } from "client/ui/components/scp";
import { useRem } from "client/ui/hooks";
import { selectPlayerTeam } from "shared/store/teams";
import { UniformSelector } from "../uniform-selector";

const player = Players.LocalPlayer;

export function CustomizeUniformPage() {
	const rem = useRem();

	const team = useSelector(selectPlayerTeam(player));

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
				<>
					{uniform
						.filter((outfit) => outfit.team === team)
						.sort((a, b) => a.uniformName < b.uniformName)
						.map((outfit) => (
							<UniformSelector uniform={outfit} previewImage="shirt" />
						))}
				</>
			))}
		</SCPScrollingFrame>
	);
}
