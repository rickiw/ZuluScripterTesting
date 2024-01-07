import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { ErrorHandler } from "./library/error";
import { InteractionProvider } from "./library/interaction/interaction-provider";
import { Layer } from "./library/layer";

const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();

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
