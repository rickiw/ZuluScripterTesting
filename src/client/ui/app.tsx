import Roact from "@rbxts/roact";
import { Customization } from "./customization/customization";
import { AerialProvider } from "./library/aerial/aerial-provider";
import { ErrorHandler } from "./library/error";
import { InteractionProvider } from "./library/interaction/interaction-provider";
import { Layer } from "./library/layer";
import { MenuProvider } from "./library/menu/menu-provider";
import { Stamina } from "./library/stamina";
import { Crosshair } from "./library/weapon/crosshair";

export function App() {
	return (
		<ErrorHandler>
			<Layer key="interaction-layer">
				<InteractionProvider key="interaction-provider" />
			</Layer>

			<Layer key="menu-layer">
				<MenuProvider key="menu-provider" />
				<Customization key="customization" />
			</Layer>

			<Layer key="daily-rewards-layers"></Layer>

			<Layer key="hud-layer">
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
