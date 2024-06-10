import { CharacterRigR15 } from "@rbxts/promise-character";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { clientStore } from "client/store";
import { selectPlayerTeam, selectTeams } from "shared/store/teams";
import { Overhead } from "./overhead";

export function OverheadProvider() {
	const teams = useSelector(selectTeams);

	return (
		<>
			{Players.GetPlayers().map((player) => {
				const character = player.Character as CharacterRigR15 | undefined;

				if (!character || !character.Head) {
					return undefined;
				}

				const team = teams[clientStore.getState(selectPlayerTeam(player)) ?? "FP"].name;

				return (
					<billboardgui
						Adornee={character.Head}
						Size={new UDim2(4, 0, 1, 0)}
						StudsOffset={new Vector3(0, 2.15, 0)}
					>
						<Overhead playerName={player.Name} teamName={team} />
					</billboardgui>
				);
			})}
		</>
	);
}
