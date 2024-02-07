import Roact from "@rbxts/roact";
import { CollectionService, Players } from "@rbxts/services";
import { CustomizationButton } from "client/ui/customization/customization-button";
import { ScrollingFrame } from "client/ui/library/frame";
import { PlayerCharacterR15 } from "../../../../CharacterTypes";
import { RBXPlayer } from "../../../../Types";

export interface CharacterGunsFrameProps {
	position: UDim2 | Roact.Binding<UDim2>;
	size: UDim2 | Roact.Binding<UDim2>;
}

const Player = Players.LocalPlayer as RBXPlayer;

export function CharacterGunsFrame(props: CharacterGunsFrameProps) {
	const weapons = CollectionService.GetTagged("baseFirearm").filter(
		(x) => x.IsDescendantOf(Player) || x.IsDescendantOf(Player.Character as Model),
	);

	const character =
		(Player.Character as PlayerCharacterR15) || (Player.CharacterAdded.Wait()[0] as PlayerCharacterR15);

	CollectionService.GetInstanceAddedSignal("baseFirearm").Connect(
		(instance) =>
			instance.IsDescendantOf(Player) ||
			(instance.IsDescendantOf(Player.Character as Model) && weapons.push(instance)),
	);

	CollectionService.GetInstanceRemovedSignal("baseFirearm").Connect(
		(instance) => weapons.indexOf(instance) !== -1 && weapons.remove(weapons.indexOf(instance)),
	);

	character.ChildAdded.Connect((instance) => instance.HasTag("baseFirearm") && weapons.push(instance));
	character.ChildRemoved.Connect(
		(instance) =>
			weapons.indexOf(instance) !== -1 &&
			instance.Parent !== Player.Backpack &&
			weapons.remove(weapons.indexOf(instance)),
	);

	Player.Backpack.ChildAdded.Connect((instance) => instance.HasTag("baseFirearm") && weapons.push(instance));
	Player.Backpack.ChildRemoved.Connect(
		(instance) =>
			weapons.indexOf(instance) !== -1 &&
			instance.Parent !== character &&
			weapons.remove(weapons.indexOf(instance)),
	);

	return (
		<ScrollingFrame position={props.position} size={props.size} backgroundTransparency={1} automaticSizing={"Y"}>
			<uigridlayout
				CellSize={UDim2.fromScale(0.95, 0.3)}
				CellPadding={UDim2.fromScale(0.95, 0.05)}
				FillDirection={Enum.FillDirection.Horizontal}
				FillDirectionMaxCells={0}
				HorizontalAlignment={Enum.HorizontalAlignment.Left}
				SortOrder={Enum.SortOrder.LayoutOrder}
				StartCorner={Enum.StartCorner.TopLeft}
				VerticalAlignment={Enum.VerticalAlignment.Top}
			/>

			{weapons.map((weapon) => (
				<CustomizationButton name={weapon.Name} previewImage={"rbxassetid://0"} />
			))}
		</ScrollingFrame>
	);
}
