import { lerpBinding, useEventListener, useUnmountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useState } from "@rbxts/roact";
import { Players, RunService } from "@rbxts/services";
import { useMotion } from "client/ui/hooks/use-motion";
import { BaseInteraction } from "shared/components/BaseInteraction";
import { springs } from "shared/constants/springs";
import { round } from "shared/utils";
import { BillboardLayer } from "../billboard-layer";
import { Group } from "../group";
import { Image } from "../image";
import { SurfaceLayer } from "../layer";
import { Text } from "../text";

export interface InteractionProps {
	adornee: BasePart | Attachment;
	surfaceType: "Billboard" | "Surface";
	keybind: Enum.KeyCode;
	prompt: ProximityPrompt;
	visible: boolean;
	interactionComponent: BaseInteraction<any, any>;
	id: string;
}

export function Interaction({
	interactionComponent,
	surfaceType,
	adornee,
	keybind,
	prompt,
	visible,
	id,
}: InteractionProps) {
	const [transition, transitionMotion] = useMotion(0);
	const [progress, updateProgress] = useState(0);
	const [bounce, bounceMotion] = useMotion(0);
	const [response, responseMotion] = useMotion(Color3.fromRGB(255, 255, 255));
	const [holdStart, setHoldStart] = useState(0);
	const [timeLeft, setTimeLeft] = useState(0);

	useUnmountEffect(() => {
		if (!adornee.IsA("Attachment")) adornee.Destroy();
		setHoldStart(0);
	});

	useEffect(() => {
		transitionMotion.spring(visible ? 1 : 0, springs.gentle);
	}, [visible]);

	useEventListener(prompt.PromptButtonHoldEnded, () => {
		setHoldStart(0);
		updateProgress(0);
	});

	useEventListener(prompt.PromptButtonHoldBegan, () => {
		setHoldStart(tick());
	});

	useEventListener(RunService.RenderStepped, () => {
		if (holdStart !== 0) {
			const totalTime = prompt.HoldDuration;
			const timeElapsed = math.abs(tick() - holdStart);
			const ratioElapsed = timeElapsed / totalTime;
			const timeLeft = totalTime - timeElapsed;
			if (totalTime > 0.5) {
				setTimeLeft(math.clamp(round(timeLeft, 1), 0, math.huge));
			}

			updateProgress(ratioElapsed);
		} else {
			updateProgress(0);
		}
	});

	useEventListener(prompt.Triggered, () => {
		updateProgress(0);
		bounceMotion.spring(1, springs.bubbly);
		task.wait(0.1);
		bounceMotion.spring(0, springs.bubbly);
	});

	useEventListener(interactionComponent.messageReceived, (player, message) => {
		if (player === Players.LocalPlayer) {
			if (message === "interaction_accepted") {
				responseMotion.spring(Color3.fromRGB(0, 255, 0), springs.bubbly);
			} else if (message === "interaction_denied") {
				responseMotion.spring(Color3.fromRGB(255, 0, 0), springs.bubbly);
			}
			task.delay(0.25, () => {
				responseMotion.spring(Color3.fromRGB(255, 255, 255));
			});
		}
	});

	function InteractionState() {
		return (
			<Group
				key="group"
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
				size={UDim2.fromScale(0.75, 0.75)}
			>
				<uiscale Scale={lerpBinding(bounce, 0.9, 1)}></uiscale>
				<Image
					key="background"
					imageTransparency={lerpBinding(transition, 1, 0)}
					size={UDim2.fromScale(1, 1)}
					imageColor={response}
					image="rbxassetid://15230174518"
				/>
				<frame
					key="progress-bar"
					Size={UDim2.fromScale(progress, progress)}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={UDim2.fromScale(0.5, 0.5)}
					BorderSizePixel={0}
					BackgroundTransparency={lerpBinding(progress, 0.95, 0.4)}
				/>
				<Text
					key="keybind-text"
					textTransparency={lerpBinding(transition, 1, 0)}
					textScaled={true}
					textColor={response}
					size={UDim2.fromScale(1, 1)}
					text={keybind.Name}
				/>
				<Text
					key="progress-text"
					textTransparency={lerpBinding(progress, 1, 0)}
					textScaled={true}
					textColor={response}
					anchorPoint={new Vector2(0, 0)}
					position={new UDim2(0, 0, 1, 5)}
					size={UDim2.fromScale(1, 0.15)}
					text={timeLeft + "s left."}
				/>
			</Group>
		);
	}

	return (
		<>
			{surfaceType === "Surface" ? (
				<SurfaceLayer
					alwaysOnTop={true}
					face={Enum.NormalId.Back}
					adornee={adornee as BasePart}
					sizingMode={Enum.SurfaceGuiSizingMode.FixedSize}
					canvasSize={new Vector2(2350, 950)}
				>
					<InteractionState />
				</SurfaceLayer>
			) : (
				<BillboardLayer alwaysOnTop={true} adornee={adornee as Attachment}>
					<InteractionState />
				</BillboardLayer>
			)}
		</>
	);
}
