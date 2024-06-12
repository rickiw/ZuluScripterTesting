import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";
import { ObjectStory } from "@rbxts/ui-labs";
import { clientStore } from "client/store";
import { RootProvider } from "client/ui/providers/root-provider";
import { WeaponCustomization } from "./weapon/weapon-customization";

const Story: ObjectStory = {
	summary: "Weapon Customization UI",
	story: (props) => {
		clientStore.setCustomizationOpen(true);
		clientStore.addModificationMount(
			ReplicatedStorage.Assets.Weapons["AK-105"].FindFirstChild("Barrel") as WeaponModificationMount,
		);
		return (
			<RootProvider>
				<WeaponCustomization />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};
export = Story;
