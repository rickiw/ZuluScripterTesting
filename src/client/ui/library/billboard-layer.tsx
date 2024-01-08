import Roact from "@rbxts/roact";
import { IS_EDIT } from "shared/constants/core";

import { Group } from "./group";

export interface LayerProps extends Roact.PropsWithChildren {
	displayOrder?: number;
}

export interface BillboardLayerProps extends Roact.PropsWithChildren {
	alwaysOnTop?: boolean;
	adornee: Attachment;
	maxDistance?: number;
}

export function Layer({ displayOrder, children }: LayerProps) {
	return IS_EDIT ? (
		<Group zIndex={displayOrder}>{children}</Group>
	) : (
		<screengui ResetOnSpawn={false} DisplayOrder={displayOrder} IgnoreGuiInset={true} ZIndexBehavior="Sibling">
			{children}
		</screengui>
	);
}

export function BillboardLayer({ adornee, maxDistance, alwaysOnTop, children }: BillboardLayerProps) {
	return IS_EDIT ? (
		<Group>{children}</Group>
	) : (
		<billboardgui
			Adornee={adornee}
			Size={UDim2.fromScale(1, 1)}
			ResetOnSpawn={false}
			ZIndexBehavior="Sibling"
			MaxDistance={maxDistance || math.huge}
			AlwaysOnTop={alwaysOnTop || false}
		>
			{children}
		</billboardgui>
	);
}
