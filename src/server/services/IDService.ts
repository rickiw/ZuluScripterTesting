import { Service } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { PlayerAdded, PlayerRemoving } from "./PlayerService";

export type HumanoidInfo = {
	player: boolean;
	model: Model & { Humanoid: Humanoid };
};

export type EntityID = number;

@Service()
export class IDService implements PlayerAdded, PlayerRemoving {
	private idMap = new Map<EntityID, HumanoidInfo>();

	playerAdded(player: Player) {
		const character = player.Character || player.CharacterAdded.Wait()[0];
		character.SetAttribute("entityId", player.UserId);
		this.idMap.set(player.UserId, { player: true, model: character as CharacterRigR15 });
	}

	playerRemoving(player: Player) {
		this.idMap.delete(player.UserId);
	}

	getModelFromID(id: EntityID) {
		return this.idMap.get(id)?.model;
	}

	removeNPC(id: EntityID) {
		this.idMap.delete(id);
	}

	getNewID() {
		let id = 0;
		while (this.idMap.has(id)) {
			id++;
		}
		return id;
	}

	registerNPC(npcModel: BaseHumanoidSCP) {
		this.idMap.set(this.getNewID(), { player: false, model: npcModel });
	}

	isPlayer(id: EntityID) {
		return this.idMap.has(id) && this.idMap.get(id)!.player;
	}
}
