import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect, useState } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { Functions } from "client/network";
import { useMotion, useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame } from "client/ui/library/frame";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
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

				{/* <Frame
					size={new UDim2(1, 0, 0, rem(3))}
					backgroundTransparency={selectedTeam === team.abbreviation ? 0 : effectTransparency}
					zIndex={3}
				>
					<uigradient
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 0),
								new NumberSequenceKeypoint(0.6, 0.5),
								new NumberSequenceKeypoint(1, 1),
							])
						}
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, Color3.fromRGB(162, 175, 65)),
								new ColorSequenceKeypoint(0.4, Color3.fromRGB(202, 205, 95)),
								new ColorSequenceKeypoint(1, Color3.fromRGB(255, 255, 255)),
							])
						}
						Rotation={88}
					/>
				</Frame> */}

				<Text
					position={UDim2.fromOffset(rem(1), rem(1))}
					size={new UDim2(0.5, 0, 1, -rem(5.5))}
					textYAlignment="Top"
					textXAlignment="Left"
					textWrapped={true}
					text={team.description}
					textColor={Color3.fromRGB(124, 128, 131)}
					textSize={rem(1.75)}
					font={fonts.robotoMono.regular}
				/>

				<Image
					position={UDim2.fromScale(0.6, 0)}
					size={new UDim2(0.4, 0, 1, -rem(4))}
					image={images.ui.glyphs[team.image]}
					backgroundTransparency={1}
					imageTransparency={defaultTransparency}
				/>
				<Image
					position={UDim2.fromScale(0.6, 0)}
					size={new UDim2(0.4, 0, 1, -rem(4))}
					image={images.ui.glyphs[`${team.image}selected` as keyof typeof images.ui.glyphs]}
					backgroundTransparency={1}
					imageTransparency={selectedTransparency}
				/>
				<Image
					position={UDim2.fromScale(0.6, 0)}
					size={new UDim2(0.4, 0, 1, -rem(4))}
					image={images.ui.glyphs[`${team.image}hovered` as keyof typeof images.ui.glyphs]}
					backgroundTransparency={1}
					imageTransparency={hoveredTransparency}
				/>

				<Frame
					backgroundColor={Color3.fromRGB(33, 38, 41)}
					size={new UDim2(1, 0, 0, rem(4))}
					position={new UDim2(0, 0, 1, -rem(4))}
				>
					<Image
						position={UDim2.fromOffset(rem(5), rem(0))}
						size={UDim2.fromOffset(rem(4), rem(4))}
						image={images.ui.icons.down}
						imageTransparency={unselectedTransparency}
					/>
					<Image
						position={UDim2.fromOffset(rem(5), rem(0))}
						size={UDim2.fromOffset(rem(4), rem(4))}
						image={
							selectedTeam === "CLASS-D" ? images.ui.icons.downselectedcd : images.ui.icons.downselected
						}
						imageTransparency={selectedTransparency}
					/>
					<Text
						position={UDim2.fromOffset(rem(12.5), rem(0))}
						textXAlignment="Left"
						size={UDim2.fromOffset(rem(20), rem(4))}
						text={team.name}
						textColor={Color3.fromRGB(124, 128, 131)}
						textSize={rem(2)}
						font={fonts.inter.bold}
					/>
				</Frame>
			</Button>
		</>
	);
}
