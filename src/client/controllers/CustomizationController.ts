import { Controller, OnStart } from "@flamework/core";
import { ControlSet } from "client/components/controls";
import { clientStore } from "client/store";
import { selectCustomizationIsOpen } from "client/store/customization";

@Controller()
export class CustomizationController implements OnStart {
	controlSet = new ControlSet();

	constructor() {}

	onStart() {
		this.controlSet.add({
			ID: `customization-toggle`,
			Name: "Customization",
			Enabled: true,
			Mobile: false,

			onBegin: () => {
				clientStore.setCustomizationOpen(!selectCustomizationIsOpen(clientStore.getState()));
			},

			controls: [Enum.KeyCode.C, Enum.KeyCode.DPadUp],
		});
	}
}
