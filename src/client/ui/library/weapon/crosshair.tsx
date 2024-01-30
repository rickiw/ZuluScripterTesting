import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectCameraFlag } from "client/store/camera";
import { useMotion } from "client/ui/hooks";
import { Image } from "client/ui/library/image";
import { springs } from "shared/constants/springs";

export function Crosshair() {
	const [transparency, transparencyMotion] = useMotion(1);

	clientStore.subscribe(selectCameraFlag("FirearmIsAiming"), (value) => {
		transparencyMotion.spring(value ? 0 : 1, springs.stiff);
	});

	return (
		<Image
			image={"rbxassetid://15367036479"}
			size={UDim2.fromOffset(10, 10)}
			position={UDim2.fromScale(0.5, 0.5)}
			anchorPoint={new Vector2(0.5, 0.5)}
			imageTransparency={transparency}
			backgroundTransparency={1}
		/>
	);
}
