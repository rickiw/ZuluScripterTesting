import { ReflexProvider } from "@rbxts/react-reflex";

import Roact from "@rbxts/roact";

import { clientStore } from "client/store";
import { RemProvider, RemProviderProps } from "./rem-provider";

interface RootProviderProps extends RemProviderProps {}

export function RootProvider({ baseRem, remOverride, children }: RootProviderProps) {
	return (
		<ReflexProvider producer={clientStore}>
			<RemProvider key="rem-provider" baseRem={baseRem} remOverride={remOverride}>
				{children}
			</RemProvider>
		</ReflexProvider>
	);
}
