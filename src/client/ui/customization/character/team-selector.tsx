import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { Functions } from "client/network";
import { useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame } from "client/ui/library/frame";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { Team, TeamAbbreviation, selectPlayerTeam } from "shared/store/teams";

interface TeamSelectorProps<T extends TeamAbbreviation> {
	team: Team<T>;
}

const player = Players.LocalPlayer;

export function TeamSelector<T extends TeamAbbreviation>({ team }: TeamSelectorProps<T>) {
	const rem = useRem();

	const selectedTeam = useSelector(selectPlayerTeam(player));

	return (
		<>
			<Button
				backgroundTransparency={1}
				event={{
					MouseButton1Click: () => {
						Functions.JoinTeam.invoke(team.abbreviation);
					},
				}}
			>
				<uistroke
					Color={Color3.fromRGB(255, 255, 255)}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Transparency={0.5}
				/>

				{selectedTeam === team.abbreviation && (
					<Frame size={new UDim2(1, 0, 0, rem(3))} zIndex={3}>
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
					</Frame>
				)}
				<Text
					position={UDim2.fromOffset(rem(1), rem(1))}
					size={new UDim2(0.5, 0, 1, -rem(5.5))}
					textYAlignment="Top"
					textXAlignment="Left"
					textWrapped={true}
					text={team.description}
					textColor={Color3.fromRGB(124, 128, 131)}
					textSize={rem(1.85)}
					font={fonts.inter.bold}
				/>
				<Image position={UDim2.fromScale(0.6, 0)} size={new UDim2(0.4, 0, 1, -rem(4))} image={team.image} />
				<Frame
					backgroundColor={Color3.fromRGB(33, 38, 41)}
					size={new UDim2(1, 0, 0, rem(4))}
					position={new UDim2(0, 0, 1, -rem(4))}
				>
					<Image
						position={UDim2.fromOffset(rem(5), rem(0))}
						size={UDim2.fromOffset(rem(4), rem(4))}
						image={images.ui.down}
					/>
					<Text
						position={UDim2.fromOffset(rem(12.5), rem(0))}
						size={UDim2.fromOffset(rem(20), rem(4))}
						text={team.name}
						textColor={Color3.fromRGB(124, 128, 131)}
						textSize={rem(2.5)}
						font={fonts.inter.bold}
					/>
				</Frame>
			</Button>
		</>
	);
}
