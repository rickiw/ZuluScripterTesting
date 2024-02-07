import Roact from "@rbxts/roact";
import { Customization } from "client/ui/customization/customization";
import { AerialProvider } from "client/ui/library/aerial/aerial-provider";
import { Crosshair } from "client/ui/library/weapon/crosshair";
import { ErrorHandler } from "./library/error";
import { InteractionProvider } from "./library/interaction/interaction-provider";
import { Layer } from "./library/layer";
import { MenuProvider } from "./library/menu/menu-provider";
import { Stamina } from "./library/stamina";

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
				{/*<WeaponProvider key={"weapon"} />*/}
				<Crosshair key={"crosshair"} />
			</Layer>

			<Layer key="aerial-layer">
				<AerialProvider key="aerial-provider" />
			</Layer>
		</ErrorHandler>
	);
}
