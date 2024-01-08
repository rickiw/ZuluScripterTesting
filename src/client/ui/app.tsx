import Roact from "@rbxts/roact";
import { ErrorHandler } from "./library/error";
import { InteractionProvider } from "./library/interaction/interaction-provider";
import { Layer } from "./library/layer";

export function App() {
	return (
		<ErrorHandler>
			<Layer key="interaction-layer">
				<InteractionProvider key="interaction-provider" />
			</Layer>

			<Layer key="menu-layer"></Layer>

			<Layer key="daily-rewards-layers"></Layer>

			<Layer key="hud-layer"></Layer>
		</ErrorHandler>
	);
}
