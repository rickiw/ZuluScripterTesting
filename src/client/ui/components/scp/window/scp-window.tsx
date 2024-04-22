import Roact from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { palette } from "shared/constants/palette";
import { Frame } from "../../../library/frame";
import { Vignette } from "../../vignette";
import { SCPCloseButton } from "../closeButton";

interface SCPWindowProps extends Roact.PropsWithChildren {
	isOpen: boolean;
	backgroundTransparency?: Roact.Binding<number> | number;
	size: Roact.Binding<UDim2> | UDim2;
	onClose?: () => void;
}

export const SCPWindow = (props: SCPWindowProps) => {
	const rem = useRem();
	const { isOpen, backgroundTransparency = 0 } = props;

	return (
		<>
			<Vignette open={isOpen} />
			{isOpen && (
				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(0, rem(80), 0, rem(36))}
					backgroundColor={palette.base}
					backgroundTransparency={backgroundTransparency}
					borderColor={Color3.fromRGB(255, 255, 255)}
					borderSize={1}
				>
					{props.children}
					<SCPCloseButton onClick={() => props.onClose?.()} backgroundTransparency={backgroundTransparency} />
				</Frame>
			)}
		</>
	);
};
