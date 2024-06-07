import { OnStart, Service } from "@flamework/core";
import { Events } from "server/network";

@Service()
export class ItemService implements OnStart {
	AFAK(player: Player, obj: unknown) {}

	FAK(player: Player, obj: unknown) {}

	onStart() {
		Events.ItemAction.connect((p, obj) => {
			warn("ItemAction", p, obj);
			// if (obj.name in this) {
			// 	this[obj.name as keyof ItemService](p, obj);
			// }
		});
	}
}
