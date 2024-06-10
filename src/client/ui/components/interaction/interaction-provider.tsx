import { Components } from "@flamework/components";
import { Dependency } from "@flamework/core";
import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { ProximityPromptService, Workspace } from "@rbxts/services";
import { clientStore } from "client/store";
import { selectInteractionIdByPrompt, selectInteractions } from "client/store/interaction";
import { BaseInteraction, InteractionInstance } from "shared/components/BaseInteraction";
import { Interaction, InteractionProps } from "./interaction";

export interface PromptStorage {
	[key: string]: InteractionProps;
}

export function InteractionProvider() {
	const interactions = useSelector(selectInteractions);

	useEventListener(ProximityPromptService.PromptShown, (prompt) => {
		if (!prompt.Parent || !prompt.HasTag("baseInteraction")) {
			return;
		}
		const components = Dependency<Components>();
		const interactionComponent = components.getComponent<BaseInteraction<any, any>>(prompt);
		if (!interactionComponent) {
			return;
		}
		const isBillboard = (interactionComponent.instance as InteractionInstance).GetAttribute("billboard") as Boolean;
		if (isBillboard) {
			clientStore.addInteraction({
				id: tostring(math.random(1000, 9999)),
				surfaceType: "Billboard",
				interactionComponent,
				keybind: prompt.KeyboardKeyCode,
				adornee: prompt.Parent.FindFirstChild("ProximityAttachment")! as Attachment,
				visible: true,
				prompt,
			});
			return;
		}
		const basePart = new Instance("Part");
		basePart.CanCollide = false;
		basePart.Anchored = true;
		basePart.Transparency = 1;
		basePart.CanQuery = false;
		basePart.Parent = Workspace.CurrentCamera;
		basePart.Size = new Vector3(interactionComponent.getStudSize(), interactionComponent.getStudSize(), 0.1);
		let targetCFrame = new CFrame();
		if (prompt.Parent.FindFirstChild("ProximityAttachment")) {
			targetCFrame = (prompt.Parent.FindFirstChild("ProximityAttachment") as Attachment).WorldCFrame;
		} else if (prompt.Parent.IsA("BasePart")) {
			targetCFrame = prompt.Parent.CFrame;
		} else if (prompt.Parent.IsA("Model")) {
			const [cf, _size] = prompt.Parent.GetBoundingBox();
			targetCFrame = cf;
		}

		basePart.CFrame = targetCFrame;
		clientStore.addInteraction({
			id: tostring(math.random(1000, 9999)),
			surfaceType: "Surface",
			interactionComponent,
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
			Promise.delay(0.25).then(() => {
				clientStore.removeInteraction(id);
			});
		}
	});

	return (
		<>
			{interactions.map((interaction) => (
				<Interaction
					key={interaction.id}
					id={interaction.id}
					surfaceType={interaction.surfaceType}
					interactionComponent={interaction.interactionComponent}
					visible={interaction.visible}
					adornee={interaction.adornee}
					keybind={interaction.keybind}
					prompt={interaction.prompt}
				/>
			))}
		</>
	);
}
