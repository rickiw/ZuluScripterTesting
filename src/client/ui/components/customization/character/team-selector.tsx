import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect, useState } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { Functions } from "client/network";
import { useMotion, useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame } from "client/ui/library/frame";
import { Group } from "client/ui/library/group";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { springs } from "shared/constants/springs";
import { Team, TeamAbbreviation, selectPlayerTeam } from "shared/store/teams";

interface TeamSelectorProps<T extends TeamAbbreviation> {
	team: Team<T>;
}

const player = Players.LocalPlayer;

type ButtonState = "Default" | "Hovered" | "Selected";

export function TeamSelector<T extends TeamAbbreviation>({ team }: TeamSelectorProps<T>) {
	const rem = useRem();

	const selectedTeam = useSelector(selectPlayerTeam(player));
	const selected = selectedTeam === team.abbreviation;

	const [buttonState, setButtonState] = useState<ButtonState>("Default");
	const [unselectedTransparency, unselectedTransparencyMotion] = useMotion(0);
	const [defaultTransparency, defaultTransparencyMotion] = useMotion(0);
	const [hoveredTransparency, hoveredTransparencyMotion] = useMotion(1);
	const [selectedTransparency, selectedTransparencyMotion] = useMotion(1);

	useEffect(() => {
		if (selected) {
			setButtonState("Selected");
		} else {
			setButtonState("Default");
		}
	}, [selectedTeam]);

	useEffect(() => {
		if (buttonState === "Default") {
			defaultTransparencyMotion.spring(0, springs.responsive);
			hoveredTransparencyMotion.spring(1, springs.responsive);
			selectedTransparencyMotion.spring(1, springs.responsive);
			unselectedTransparencyMotion.spring(0, springs.responsive);
		} else if (buttonState === "Hovered") {
			defaultTransparencyMotion.spring(1, springs.responsive);
			hoveredTransparencyMotion.spring(0, springs.responsive);
			selectedTransparencyMotion.spring(1, springs.responsive);
		} else if (buttonState === "Selected") {
			defaultTransparencyMotion.spring(1, springs.responsive);
			hoveredTransparencyMotion.spring(1, springs.responsive);
			selectedTransparencyMotion.spring(0, springs.responsive);
			unselectedTransparencyMotion.spring(1, springs.responsive);
		}
	}, [buttonState]);

	return (
		<>
			<Button
				backgroundTransparency={1}
				event={{
					MouseButton1Click: () => {
						const joined = Functions.JoinTeam.invoke(team.abbreviation).expect();
						if (joined) {
							setButtonState("Selected");
						}
					},
					MouseEnter: () => setButtonState(selected ? "Selected" : "Hovered"),
					MouseLeave: () => setButtonState(selected ? "Selected" : "Default"),
				}}
			>
				<uistroke
					Color={Color3.fromRGB(255, 255, 255)}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Transparency={0.5}
				/>
				<Group size={new UDim2(1, 0, 1, -rem(3))}>
					<Text
						position={UDim2.fromOffset(rem(1), rem(1))}
						size={new UDim2(0.5, 0, 1, 0)}
						textYAlignment="Top"
						textXAlignment="Left"
						textWrapped={true}
						text={team.description}
						textColor={palette.surface2}
						textSize={rem(1.25)}
						font={fonts.arimo.italic}
					/>

					<Image
						size={UDim2.fromScale(1, 1)}
						image={images.ui.misc.selectionbackground}
						imageTransparency={hoveredTransparency}
						zIndex={-1}
					/>
					<Image
						position={UDim2.fromScale(1, 1)}
						anchorPoint={new Vector2(1, 1)}
						size={new UDim2(1, 0, 1, -rem(2))}
						image={images.ui.glyphs[team.image]}
						backgroundTransparency={1}
						imageTransparency={defaultTransparency}
					>
						<uiaspectratioconstraint AspectRatio={1.34736} DominantAxis={Enum.DominantAxis.Height} />
					</Image>
					<Image
						position={UDim2.fromScale(1, 1)}
						anchorPoint={new Vector2(1, 1)}
						size={new UDim2(1, 0, 1, -rem(2))}
						image={images.ui.glyphs[`${team.image}selected` as keyof typeof images.ui.glyphs]}
						backgroundTransparency={1}
						imageTransparency={selectedTransparency}
					>
						<uiaspectratioconstraint AspectRatio={1.34736} DominantAxis={Enum.DominantAxis.Height} />
					</Image>
					<Image
						position={UDim2.fromScale(1, 1)}
						anchorPoint={new Vector2(1, 1)}
						size={new UDim2(1, 0, 1, -rem(2))}
						image={images.ui.glyphs[`${team.image}hovered` as keyof typeof images.ui.glyphs]}
						backgroundTransparency={1}
						imageTransparency={hoveredTransparency}
					>
						<uiaspectratioconstraint AspectRatio={1.34736} DominantAxis={Enum.DominantAxis.Height} />
					</Image>
				</Group>

				<Frame
					backgroundColor={Color3.fromRGB(33, 38, 41)}
					size={new UDim2(1, 0, 0, rem(3))}
					position={new UDim2(0, 0, 1, -rem(3))}
				>
					<Image
						position={UDim2.fromOffset(rem(5), rem(0))}
						size={UDim2.fromScale(1, 1)}
						image={images.ui.icons.down}
						imageTransparency={unselectedTransparency}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</Image>
					<Image
						position={UDim2.fromOffset(rem(5), rem(0))}
						size={UDim2.fromScale(1, 1)}
						image={
							selectedTeam === "CLASS-D"
								? images.ui.icons.downselectedcd
								: images.ui.icons.downselectedwhite
						}
						imageTransparency={selectedTransparency}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</Image>
					<Text
						position={UDim2.fromOffset(rem(8), rem(0))}
						textXAlignment="Left"
						size={UDim2.fromOffset(rem(20), rem(4))}
						text={team.name}
						textColor={palette.subtext1}
						textSize={rem(1.5)}
						font={fonts.arimo.bold}
					/>
				</Frame>
			</Button>
		</>
	);
}
