import { Component } from "@flamework/components";
import { Events } from "server/network";
import { BasePresence, PresenceInstanceBasePart } from "shared/components/BasePresence";

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
	constructor() {
		super();
	}

	onStart() {
		super.onStart();

		this.presenceBegin.Connect((plr) =>
			Events.AreaEntered.fire(plr, this.attributes.title, this.attributes.description),
		);
	}
}
