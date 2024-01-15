import Roact from "@rbxts/roact";
import { IS_EDIT } from "shared/constants/core";

import { Group } from "./group";

export interface LayerProps extends Roact.PropsWithChildren {
	displayOrder?: number;
}

export interface SurfaceLayerProps extends Roact.PropsWithChildren {
	alwaysOnTop?: boolean;
	adornee: BasePart;
	sizingMode?: Enum.SurfaceGuiSizingMode;
	pixelsPerStud?: number;
	canvasSize?: Vector2;
	enabled?: boolean;
	face?: Enum.NormalId;
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

export function SurfaceLayer({
	face,
	sizingMode,
	pixelsPerStud,
	canvasSize,
	adornee,
	alwaysOnTop,
	enabled,
	children,
}: SurfaceLayerProps) {
	return IS_EDIT ? (
		<Group>{children}</Group>
	) : (
		<surfacegui
			Face={face}
			SizingMode={sizingMode}
			PixelsPerStud={pixelsPerStud}
			CanvasSize={canvasSize}
			Adornee={adornee}
			ResetOnSpawn={false}
			ZIndexBehavior="Sibling"
			AlwaysOnTop={alwaysOnTop || false}
			Enabled={enabled}
		>
			{children}
		</surfacegui>
	);
}
