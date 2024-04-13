import Roact from "@rbxts/roact";
import { fonts } from "shared/constants/fonts";
import { useRem } from "../hooks";
import { Group, GroupProps } from "../library/group";
import { Text } from "../library/text";

interface RecipeSelectionProps extends GroupProps {
	backgroundTransparency?: Roact.Binding<number>;
}

export const RecipeSelection = ({ size, backgroundTransparency, position }: RecipeSelectionProps) => {
	const rem = useRem();

	return (
		<Group size={size} position={position}>
			<Text
				text={"SELECT TO COOK"}
				position={UDim2.fromOffset(rem(0), rem(0))}
				size={UDim2.fromOffset(rem(30), rem(1.5))}
				textColor={Color3.fromRGB(255, 255, 255)}
				textSize={rem(1.5)}
				textTransparency={
					backgroundTransparency?.map((transparency) => math.clamp(transparency + 0.25, 0, 1)) ?? 1
				}
				backgroundTransparency={1}
				textWrapped={true}
				textXAlignment="Left"
				textYAlignment="Center"
				font={fonts.inter.bold}
			/>
		</Group>
	);
};
