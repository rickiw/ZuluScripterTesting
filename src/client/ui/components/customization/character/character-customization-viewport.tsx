import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectCharacterCustomizationModel } from "client/store/customization";
import { useRem } from "client/ui/hooks";
import ObjectViewport from "client/ui/library/object-viewport";

export function CharacterCustomizationViewport() {
	const rem = useRem();

	const characterModel = useSelector(selectCharacterCustomizationModel);

	return (
		<>
			{characterModel && (
				<ObjectViewport
					Native={{
						BackgroundTransparency: 1,
						Size: new UDim2(1, -rem(36), 1, 0),
						Position: UDim2.fromOffset(rem(36), 0),
					}}
					Object={characterModel}
					ExtraCameraDepth={2}
				/>
			)}
		</>
	);
}
