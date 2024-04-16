import { useSelector } from "@rbxts/react-reflex";
import Roact, { useMemo } from "@rbxts/roact";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { selectRecipes } from "shared/store/food";
import { useMotion, useRem } from "../hooks";
import { Button, ButtonProps } from "../library/button/button";
import { Group, GroupProps } from "../library/group";
import { SCPTable } from "../library/scp";
import { Text } from "../library/text";

interface FoodSelectionProps extends GroupProps {
	backgroundTransparency?: Roact.Binding<number>;
}

const FoodTableItem = (props: ButtonProps) => {
	const rem = useRem();
	const [hover, hoverMotion] = useMotion(0);

	return (
		<Button
			text=""
			size={new UDim2(1, 0, 0, rem(2))}
			backgroundColor={hover.map((value) => {
				return palette.surface0.Lerp(palette.surface1, value);
			})}
			backgroundTransparency={props.backgroundTransparency}
			borderColor={hover.map((value) => {
				return palette.surface1.Lerp(palette.surface2, value);
			})}
			onClick={props.onClick}
			onMouseEnter={() => hoverMotion.spring(1)}
			onMouseLeave={() => hoverMotion.spring(0)}
			borderSize={1}
		>
			<Text
				zIndex={2}
				size={new UDim2(0, rem(8), 0, rem(1.5))}
				position={new UDim2(0, rem(0.5), 0, rem(0.25))}
				textColor={Color3.fromRGB(255, 255, 255)}
				textAutoResize="X"
				borderSize={1}
				borderColor={Color3.fromRGB(255, 255, 255)}
				backgroundColor={Color3.fromRGB(16, 20, 21)}
				backgroundTransparency={props.backgroundTransparency}
				textSize={rem(1.5)}
				font={fonts.robotoMono.regular}
				text={props.text?.upper()}
				textXAlignment="Left"
				textYAlignment="Center"
			/>
		</Button>
	);
};

export const FoodSelection = ({ size, backgroundTransparency, position }: FoodSelectionProps) => {
	const rem = useRem();
	const recipes = useSelector(selectRecipes);
	const [column1, column2] = useMemo(() => {
		const column1: string[] = [];
		const column2: string[] = [];
		if (recipes.size() < 5) {
			return [recipes, []];
		}
		for (let i = 0; i < recipes.size(); i++) {
			if (i % 2 === 0) {
				column1.push(recipes[i]);
			} else {
				column2.push(recipes[i]);
			}
		}

		return [column1, column2];
	}, [recipes]);

	return (
		<Group size={size} position={position}>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Left}
				VerticalAlignment={Enum.VerticalAlignment.Top}
				Padding={new UDim(0, rem(1.5))}
			/>
			<Text
				text={"SELECT TO COOK"}
				size={UDim2.fromOffset(rem(30), rem(1.5))}
				textColor={palette.subtext1}
				textSize={rem(1.5)}
				textTransparency={
					backgroundTransparency?.map((transparency) => math.clamp(transparency + 0.25, 0, 1)) ?? 1
				}
				backgroundTransparency={1}
				textWrapped={true}
				textXAlignment="Left"
				textYAlignment="Center"
				font={fonts.inter.extra}
			/>
			<Group size={new UDim2(1, 0, 1, -rem(2))}>
				<uilistlayout FillDirection={Enum.FillDirection.Horizontal} Padding={new UDim(0, rem(4))} />
				<SCPTable
					onItemClicked={(item) => print(`${item} clicked`)}
					backgroundTransparency={backgroundTransparency}
					size={UDim2.fromScale(0.5, 1)}
					items={column1}
					ItemComponent={FoodTableItem}
					header={"Food Options"}
				/>
				<SCPTable
					backgroundTransparency={backgroundTransparency}
					onItemClicked={(item) => print(`${item} clicked`)}
					size={UDim2.fromScale(0.5, 1)}
					items={column2}
					ItemComponent={FoodTableItem}
					header={"Food Options"}
				/>
			</Group>
		</Group>
	);
};
