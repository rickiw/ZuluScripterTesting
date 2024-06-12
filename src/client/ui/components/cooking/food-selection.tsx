import { useSelector } from "@rbxts/react-reflex";
import Roact, { useMemo } from "@rbxts/roact";
import { Events } from "client/network";
import { clientStore } from "client/store";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { selectRecipes } from "shared/store/food";
import { useRem } from "../../hooks";
import { Group, GroupProps } from "../../library/group";
import { Text } from "../../library/text";
import { SCPTable, SCPTextTableItem } from "../scp";

interface FoodSelectionProps extends GroupProps {
	backgroundTransparency?: Roact.Binding<number>;
}

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
					backgroundTransparency={backgroundTransparency}
					size={UDim2.fromScale(0.5, 1)}
					header={"Food Options"}
				>
					{column1.map((item, key) => (
						<SCPTextTableItem
							text={item}
							key={`item_${key}`}
							onClick={() => {
								Events.CookFood.fire(item);
								clientStore.setCookingOpen(false);
							}}
						/>
					))}
				</SCPTable>
				<SCPTable
					backgroundTransparency={backgroundTransparency}
					size={UDim2.fromScale(0.5, 1)}
					header={"Food Options"}
				>
					{column2.map((item, key) => (
						<SCPTextTableItem
							text={item}
							key={`item_${key}`}
							onClick={() => {
								Events.CookFood.fire(item);
								clientStore.setCookingOpen(false);
							}}
						/>
					))}
				</SCPTable>
			</Group>
		</Group>
	);
};
