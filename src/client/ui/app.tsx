import Roact from "@rbxts/roact";
import { AerialProvider } from "./components/aerial/aerial-provider";
import { CookingProvider } from "./components/cooking/cooking-provider";
import { CustomizationProvider } from "./components/customization/customization-provider";
import { InteractionProvider } from "./components/interaction/interaction-provider";
import { UpgradeProvider } from "./components/item-upgrade/upgrade-provider";
import { KillEffectProvider } from "./components/kill-effect/kill-effect-provider";
import { MenuProvider } from "./components/menu/menu-provider";
import { NotificationProvider } from "./components/notification/notification-provider";
import { ObjectiveProvider } from "./components/objective/objective-provider";
import { OverheadProvider } from "./components/overhead/overhead-provider";
import { Stamina } from "./components/vitals/stamina";
import { Vitals } from "./components/vitals/vitals";
import { Crosshair } from "./components/weapon/crosshair";
import { WeaponInfo } from "./components/weapon/weapon-info";
import { Layer } from "./library/layer";

export function App() {
	return (
		<>
			<Layer key="interaction-layer">
				<InteractionProvider key="interaction-provider" />
				<UpgradeProvider key="upgrade-provider" />
				<ObjectiveProvider key="objective-provider" />
			</Layer>

			<Layer key="menu-layer">
				<MenuProvider key="menu-provider" />
				<CustomizationProvider key="customization-provider" />
				<CookingProvider key="cooking-provider" />
				<NotificationProvider key="notification-provider" />
			</Layer>

			<Layer key="daily-rewards-layers"></Layer>

			<Layer key="hud-layer">
				<Vitals key="vitals" />
				<Stamina key="stamina" />
				<Crosshair key="crosshair" />
				<WeaponInfo key="weapon-info" />
				<KillEffectProvider key="kill-effect-provider" />
				<OverheadProvider key="overhead-provider" />
			</Layer>

			<Layer key="aerial-layer">
				<AerialProvider key="aerial-provider" />
			</Layer>
		</>
	);
}
