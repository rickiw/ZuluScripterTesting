import { ReflexProvider } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { clientStore } from "client/store";
import { Overlay } from "./overlay";

const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();

export function App() {
	return (
		<ReflexProvider producer={clientStore}>
			{IS_EDIT ? (
				<Overlay />
			) : (
				<screengui ResetOnSpawn={false} ZIndexBehavior="Sibling" IgnoreGuiInset>
					<Overlay />
				</screengui>
			)}
		</ReflexProvider>
	);
}
