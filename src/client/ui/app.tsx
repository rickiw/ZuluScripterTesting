import Roact from "@rbxts/roact";
import { Stamina } from "./components/vitals/stamina";
import { Vitals } from "./components/vitals/vitals";
import { Crosshair } from "./components/weapon/crosshair";
import { WeaponInfo } from "./components/weapon/weapon-info";
import { Layer } from "./library/layer";
import { AerialProvider } from "./providers/aerial-provider";
import { CookingProvider } from "./providers/cooking-provider";
import { CustomizationProvider } from "./providers/customization-provider";
import { InteractionProvider } from "./providers/interaction-provider";
import { KillEffectProvider } from "./providers/kill-effect-provider";
import { MenuProvider } from "./providers/menu-provider";
import { NotificationProvider } from "./providers/notification-provider";
import { ObjectiveProvider } from "./providers/objective-provider";
import { OverheadProvider } from "./providers/overhead-provider";
import { UpgradeProvider } from "./providers/upgrade-provider";

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
