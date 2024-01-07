import Log, { Logger } from "@rbxts/log";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import Roact, { StrictMode } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { App } from "../ui/app";
import { RootProvider } from "../ui/providers/root-provider";

export async function bootstrap() {
	Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

	const root = createRoot(new Instance("Folder"));
	const target = Players.LocalPlayer.WaitForChild("PlayerGui");

	root.render(
		createPortal(
			<StrictMode>
				<RootProvider key="root-provider">
					<App key="app" />
				</RootProvider>
			</StrictMode>,
			target,
		),
	);
}
