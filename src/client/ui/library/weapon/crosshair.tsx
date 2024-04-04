import { useSelector } from "@rbxts/react-reflex";
import Roact, { useMemo } from "@rbxts/roact";
import { selectCameraFlag } from "client/store/camera";
import { useMotion } from "client/ui/hooks";
import { Image } from "client/ui/library/image";
import { springs } from "shared/constants/springs";

export function Crosshair() {
	const [transparency, transparencyMotion] = useMotion(1);
	const aimFlag = useSelector(selectCameraFlag("FirearmIsAiming"));

	useMemo(() => {
		transparencyMotion.spring(aimFlag ? 0 : 1, springs.stiff);
	}, [aimFlag]);

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
