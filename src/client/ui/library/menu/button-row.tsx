import { lerpBinding } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { useMotion, useRem } from "client/ui/hooks";
import { fonts } from "shared/constants/fonts";
import { Button } from "../button/button";
import { Frame } from "../frame";

export const buttons = ["Shop", "Objectives", "Clan", "Perks"] as const;

export function ButtonRow() {
	const rem = useRem();

	const [shopHover, shopHoverMotion] = useMotion(0);
	const [objectivesHover, objectivesHoverMotion] = useMotion(0);
	const [clanHover, clanHoverMotion] = useMotion(0);
	const [perksHover, perksHoverMotion] = useMotion(0);

	return (
		<Frame
			backgroundTransparency={1}
			position={new UDim2(0, rem(31), 0, rem(1))}
			size={new UDim2(0, rem(60), 0, rem(2))}
		>
			<uigridlayout
				CellPadding={UDim2.fromOffset(5, 5)}
				CellSize={UDim2.fromOffset(rem(12.5), rem(3))}
				FillDirection={Enum.FillDirection.Horizontal}
			/>
			{buttons.map((button) => (
				<Frame backgroundTransparency={1} size={UDim2.fromScale(1, 1)}>
					<Button
						key={button.upper()}
						text={button.upper()}
						backgroundColor={Color3.fromRGB(0, 0, 0)}
						backgroundTransparency={0.6}
						borderColor={Color3.fromRGB(255, 255, 255)}
						borderSize={1}
						anchorPoint={new Vector2(0.5, 0.5)}
						textColor={Color3.fromRGB(255, 255, 255)}
						textSize={rem(1.25)}
						textWrapped={true}
						fontFace={fonts.gothic.regular}
						size={lerpBinding(
							button === "Clan"
								? clanHover
								: button === "Objectives"
								? objectivesHover
								: button === "Perks"
								? perksHover
								: shopHover,
							UDim2.fromScale(0.95, 0.9),
							UDim2.fromScale(1, 1),
						)}
						position={UDim2.fromScale(0.5, 0.5)}
						event={{
							MouseEnter: () => {
								switch (button) {
									case "Shop":
										shopHoverMotion.spring(1);
										break;
									case "Objectives":
										objectivesHoverMotion.spring(1);
										break;
									case "Clan":
										clanHoverMotion.spring(1);
										break;
									case "Perks":
										perksHoverMotion.spring(1);
										break;
								}
							},
							MouseLeave: () => {
								switch (button) {
									case "Shop":
										shopHoverMotion.spring(0);
										break;
									case "Objectives":
										objectivesHoverMotion.spring(0);
										break;
									case "Clan":
										clanHoverMotion.spring(0);
										break;
									case "Perks":
										perksHoverMotion.spring(0);
										break;
								}
							},
							MouseButton1Up: () => clientStore.setMenuPage(button),
						}}
					/>
				</Frame>
			))}
		</Frame>
	);
}
