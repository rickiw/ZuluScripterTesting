import { Service } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { BaseSCPInstance, SCPAdded, SCPRemoving } from "server/components/scp/BaseSCP";
import { PlayerAdded, PlayerRemoving } from "./PlayerService";

export type HumanoidInfo = {
	player: boolean;
	model: Model & { Humanoid: Humanoid };
};

export type EntityID = number;

@Service()
export class IDService implements PlayerAdded, PlayerRemoving, SCPAdded, SCPRemoving {
	private idMap = new Map<EntityID, HumanoidInfo>();
	private usedIds = 0;

	playerAdded(player: Player) {
		const id = this.getNewID();
		const character = player.Character || player.CharacterAdded.Wait()[0];
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
		const character = player.Character || player.CharacterAdded.Wait()[0];
		const id = character.GetAttribute("entityId") as number;
		this.idMap.delete(id);
	}

	scpRemoving(scp: BaseSCPInstance) {
		const id = scp.GetAttribute("entityId") as number;
		this.idMap.delete(id);
	}

	getModelFromID(id: EntityID) {
		return this.idMap.get(id)?.model;
	}

	private getNewID() {
		const id = this.usedIds + 1;
		this.usedIds++;
		return id;
	}

	isPlayer(id: EntityID) {
		return this.idMap.has(id) && this.idMap.get(id)!.player;
	}
}