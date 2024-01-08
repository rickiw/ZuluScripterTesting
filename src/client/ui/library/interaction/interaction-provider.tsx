import { New } from "@rbxts/fusion";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { ProximityPromptService, Workspace } from "@rbxts/services";
import { clientStore } from "client/store";
import { selectInteractionIdByPrompt, selectInteractions } from "client/store/interaction";
import { Interaction, InteractionProps } from "./interaction";

export interface PromptStorage {
	[key: string]: InteractionProps;
}

export function InteractionProvider() {
	const interactions = useSelector(selectInteractions);
	useEventListener(ProximityPromptService.PromptShown, (prompt) => {
		if (!prompt.Parent) return;
		const promptSize = (prompt.GetAttribute("studSize") as number) ?? 1.5;
		let targetCFrame = new CFrame();
		if (prompt.Parent.FindFirstChildOfClass("Attachment")) {
			targetCFrame = prompt.Parent.FindFirstChildOfClass("Attachment")!.WorldCFrame;
		} else if (prompt.Parent.IsA("BasePart")) {
			targetCFrame = prompt.Parent.CFrame;
		} else if (prompt.Parent.IsA("Model")) {
			const [cf, size] = prompt.Parent.GetBoundingBox();
			targetCFrame = cf;
		}
		const basePart = New("Part")({
			CanCollide: false,
			Anchored: true,
			Transparency: 1,
			CanQuery: false,
			Parent: Workspace.CurrentCamera,
			Size: new Vector3(promptSize, promptSize, 0.1),
			CFrame: targetCFrame,
		});

		clientStore.addInteraction({
			id: tostring(math.random(1000, 9999)),
			keybind: prompt.KeyboardKeyCode,
			adornee: basePart,
			visible: true,
			prompt,
		});
	});
	useEventListener(ProximityPromptService.PromptHidden, (prompt) => {
		const id = clientStore.getState(selectInteractionIdByPrompt(prompt));

		if (id !== false) {
			clientStore.setInteractionVisible(id, false);
			Promise.delay(0.25).then(() => clientStore.removeInteraction(id));
		}
	});
	return (
		<>
			{/* {interactions.map((interaction) => {
				<Interaction
					key={interaction.id}
					id={interaction.id}
					keybind={interaction.keybind}
					adornee={interaction.adornee}
					prompt={interaction.prompt}
					visible={interaction.visible}
				/>;
			})} */}
		</>
	);
}
