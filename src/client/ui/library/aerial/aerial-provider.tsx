import { useEventListener } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { useMotion } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { playSound } from "shared/assets/sounds/play-sound";
import { springs } from "shared/constants/springs";
import { GlobalEvents } from "shared/network";

export function AerialProvider() {
	const [titleBinding, setTitle] = Roact.createBinding("");
	const [descBinding, setDesc] = Roact.createBinding("");
	const [easeSeparator, easeSeparatorMotion] = useMotion(0);
	const [easeTitle, easeTitleMotion] = useMotion(0);
	const [easeDesc, easeDescMotion] = useMotion(0);
	const Net = GlobalEvents.createClient({});

	let AreaInEffect = false;

	useEventListener(Net.AreaEntered, (title, desc) => {
		while (AreaInEffect) wait();
		AreaInEffect = true;
		setTitle(title);
		setDesc(desc);

		playSound("rbxassetid://860460765", { volume: 1.3 });
		easeSeparatorMotion.spring(1, springs.gentle);
		wait(0.5);
		easeTitleMotion.spring(1, springs.gentle);
		wait(0.5);
		easeDescMotion.spring(1, springs.gentle);

		wait(3);

		easeDescMotion.spring(0, springs.gentle);
		wait(0.3);
		easeTitleMotion.spring(0, springs.gentle);
		wait(0.5);
		easeSeparatorMotion.spring(0, springs.gentle);
		wait(1);
		AreaInEffect = false;
	});

	return (
		<Frame
			size={easeSeparator.map((v) => UDim2.fromScale(0.3 * v, 0.005))}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={UDim2.fromScale(0.5, 0.2)}
			backgroundColor={Color3.fromRGB(255, 255, 255)}
		>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, -5.5)}
				size={UDim2.fromScale(1, 10)}
				clipsDescendants={true}
				backgroundTransparency={1}
			>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					text={titleBinding}
					size={UDim2.fromScale(1, 1)}
					textScaled={true}
					font={Font.fromEnum(Enum.Font.MontserratMedium)}
					richText={true}
					textColor={Color3.fromRGB(255, 255, 255)}
					position={easeTitle.map((v) => UDim2.fromScale(0.5, 1.5 - v))}
				/>
			</Frame>

			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 8.75)}
				size={UDim2.fromScale(1, 17.5)}
				clipsDescendants={true}
				backgroundTransparency={1}
			>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					text={descBinding}
					size={UDim2.fromScale(1, 1)}
					textScaled={true}
					font={Font.fromEnum(Enum.Font.MontserratMedium)}
					richText={true}
					textColor={Color3.fromRGB(255, 255, 255)}
					position={easeDesc.map((v) => UDim2.fromScale(0.5, -0.5 + v))}
				/>
			</Frame>
		</Frame>
	);
}
