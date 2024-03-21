import Roact from "@rbxts/roact";
import { CustomizationProvider } from "./customization/customization-provider";
import { AerialProvider } from "./library/aerial/aerial-provider";
import { ErrorHandler } from "./library/error";
import { InteractionProvider } from "./library/interaction/interaction-provider";
import { Layer } from "./library/layer";
import { Stamina } from "./library/stamina";
import { UpgradeProvider } from "./library/upgrade/upgrade-provider";
import { Vitals } from "./library/vitals";
import { Crosshair } from "./library/weapon/crosshair";
import { MenuProvider } from "./menu/menu-provider";

export function App() {
	return (
		<ErrorHandler>
			<Layer key="interaction-layer">
				<InteractionProvider key="interaction-provider" />
				<UpgradeProvider key="upgrade-provider" />
			</Layer>

			<Layer key="menu-layer">
				<MenuProvider key="menu-provider" />
				<CustomizationProvider key="customization-provider" />
			</Layer>

			<Layer key="daily-rewards-layers"></Layer>

			<Layer key="hud-layer">
				<Vitals key="vitals" />
				<Stamina key="stamina" />
				{/* <WeaponProvider key="weapon" /> */}
				<Crosshair key="crosshair" />
			</Layer>

			<Layer key="aerial-layer">
				<AerialProvider key="aerial-provider" />
			</Layer>
		</ErrorHandler>
	);
}
