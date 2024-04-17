import Roact from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { ScrollingFrame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";

export function CustomizeCharacterPage() {
	const rem = useRem();

	return (
		<>
			<ScrollingFrame size={UDim2.fromScale(1, 1)} backgroundTransparency={1}>
				<Text position={new UDim2()} size={UDim2.fromOffset(rem(37.5), rem(7.5))} text="SKIN COLOR" />
			</ScrollingFrame>
		</>
	);
}
