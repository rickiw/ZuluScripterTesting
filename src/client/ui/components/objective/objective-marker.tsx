import { New } from "@rbxts/fusion";
import { useInterval, useMountEffect, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useState } from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { selectCustomizationIsOpen } from "client/store/customization";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { Objective } from "shared/store/objectives";

export interface ObjectiveMarkerProps {
	objective: Objective;
}

const player = Players.LocalPlayer;
const character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;

export function ObjectiveMarker({ objective }: ObjectiveMarkerProps) {
	const rem = useRem();

	const inCustomizationMenu = useSelector(selectCustomizationIsOpen);
	const objectivePosition = objective.location as Vector3;

	const [distance, setDistance] = useState(0);
	const [adornee, setAdornee] = useState<BasePart | undefined>(undefined);

	useInterval(() => {
		if (character && character.PrimaryPart) {
			setDistance(character.PrimaryPart.Position.sub(objectivePosition).Magnitude);
		}
	}, 0.5);

	useMountEffect(() => {
		const adornee = New("Part")({
			Parent: Workspace,
			Name: "ObjectiveMarker",
			Size: new Vector3(0.1, 0.1, 0.1),
			CanCollide: false,
			CanQuery: false,
			Anchored: true,
			Transparency: 1,
			Position: objectivePosition,
		});

		setAdornee(adornee);
	});

	useUnmountEffect(() => {
		adornee?.Destroy();
		setAdornee(undefined);
	});

	return (
		<>
			{!inCustomizationMenu && distance > 5 && adornee && (
				<billboardgui Adornee={adornee} Size={UDim2.fromOffset(rem(20), rem(20))} AlwaysOnTop>
					<Frame
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.5, 0.5)}
						size={UDim2.fromOffset(rem(5), rem(7.5))}
						backgroundTransparency={1}
					>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0, rem(5))}
							size={UDim2.fromOffset(rem(5), rem(5))}
							image={images.ui.misc.objectivemarker}
						/>
						<Text
							anchorPoint={new Vector2(0.5, 0.5)}
							position={new UDim2(0.5, 0, 0, rem(10))}
							font={fonts.inter.medium}
							text={`${string.format("%.1f", distance)}m`}
							textSize={rem(3)}
							textColor={Color3.fromRGB(255, 255, 255)}
							size={UDim2.fromOffset(rem(5), rem(2.5))}
						/>
					</Frame>
				</billboardgui>
			)}
		</>
	);
}
