import { OnStart, Service } from "@flamework/core";
import { InsertService, Workspace } from "@rbxts/services";
import { Events, Functions } from "server/network";

@Service()
export class ItemService implements OnStart {
	AFAK(player: Player, obj: unknown) {}

	FAK(player: Player, obj: unknown) {}

	onStart() {
		Functions.GetAssetAccessory.setCallback((player, assetId) => {
			const accessory = InsertService.LoadAsset(assetId);
			accessory.Parent = Workspace;
			return accessory.FindFirstChildOfClass("Accessory")!;
		});
		Events.ItemAction.connect((p, obj) => {
			warn("ItemAction", p, obj);
			// if (obj.name in this) {
			// 	this[obj.name as keyof ItemService](p, obj);
			// }
		});
	}
}
