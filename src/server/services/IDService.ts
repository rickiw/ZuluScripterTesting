import { Service } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players } from "@rbxts/services";
import { BaseSCPInstance, SCPAdded, SCPRemoving } from "server/components/scp/BaseSCP";
import { CharacterAdded, PlayerRemoving } from "./PlayerService";

export type HumanoidInfo = {
	player: boolean;
	model: Model & { Humanoid: Humanoid };
};

export type EntityID = number & {
	/**
	 * @hidden
	 */
	readonly __nominal_id: unique symbol;
};

@Service()
export class IDService implements CharacterAdded, PlayerRemoving, SCPAdded, SCPRemoving {
	private idMap = new Map<EntityID, HumanoidInfo>();
	private usedIds = 0;

	characterAdded(character: CharacterRigR15) {
		const id = this.getNewID();
		const player = Players.GetPlayerFromCharacter(character);
		player?.SetAttribute("entityId", id);
		character.SetAttribute("entityId", id);
		this.idMap.set(id, { player: true, model: character as CharacterRigR15 });
	}

	scpAdded(scp: BaseSCPInstance) {
		const id = this.getNewID();
		scp.SetAttribute("entityId", id);
		if (!scp.FindFirstChildWhichIsA("Humanoid")) return;
		const model = scp as BaseHumanoidSCP;
		this.idMap.set(id, { player: false, model });
	}

	playerRemoving(player: Player) {
		const id = player.GetAttribute("entityId") as EntityID;
		this.idMap.delete(id);
	}

	scpRemoving(scp: BaseSCPInstance) {
		const id = scp.GetAttribute("entityId") as EntityID;
		this.idMap.delete(id);
	}

	getModelFromID(id: EntityID) {
		return this.idMap.get(id)?.model;
	}

	private getNewID() {
		this.usedIds++;
		return this.usedIds as EntityID;
	}

	isPlayer(id: EntityID) {
		return this.idMap.has(id) && this.idMap.get(id)!.player;
	}
}
