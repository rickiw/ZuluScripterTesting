import Roact from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";

interface CornerEffectProps {
	rotation?: number;
	position?: UDim2;
}

export function OutlineCornerEffect() {
	const rem = useRem();

	return (
		<>
			{/* Top Left */}
			<CornerEffect rotation={0} position={UDim2.fromScale(0, 0)} />
			{/* Top Right */}
			<CornerEffect rotation={90} position={new UDim2(1, -rem(5), 0, 0)} />
			{/* Bottom Left */}
			<CornerEffect rotation={-90} position={new UDim2(0, 0, 1, -rem(5))} />
			{/* Bottom Right */}
			<CornerEffect rotation={180} position={new UDim2(1, -rem(5), 1, -rem(5))} />
		</>
	);
}

export function CornerEffect({ position, rotation = 0 }: CornerEffectProps) {
	const rem = useRem();

	return (
		<Frame
			backgroundTransparency={1}
			size={UDim2.fromOffset(rem(5), rem(5))}
			rotation={rotation}
			position={position}
		>
			<Frame
				backgroundColor={Color3.fromRGB(255, 255, 255)}
				size={UDim2.fromScale(0.1, 1)}
				position={UDim2.fromScale(0, 0)}
			/>
			<Frame
				backgroundColor={Color3.fromRGB(255, 255, 255)}
				size={UDim2.fromScale(1, 0.1)}
				position={UDim2.fromScale(0, 0)}
			/>
		</Frame>
	);
}
