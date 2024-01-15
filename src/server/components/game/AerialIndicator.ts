import { Component } from "@flamework/components";
import { BasePresence, PresenceInstanceBasePart } from "shared/components/game/BasePresence";
import { GlobalEvents } from "shared/network";

export interface AerialAttributes {
	title: string;
	description: string;
}

@Component({
	tag: "aerialIndicator",
	defaults: {
		title: "Area entered",
		description: "You've entered an area",
	},
})
export class AerialIndicator extends BasePresence<AerialAttributes, PresenceInstanceBasePart> {
	net = GlobalEvents.createServer({});
	constructor() {
		super();
	}

	onStart() {
		super.onStart();

		this.presenceBegin.Connect((plr) =>
			this.net.AreaEntered(plr, this.attributes.title, this.attributes.description),
		);
	}
}
