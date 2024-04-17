import { lerpBinding } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect } from "@rbxts/roact";
import { useMotion } from "client/ui/hooks";
import { images } from "shared/assets/images";
import { palette } from "shared/constants/palette";
import { springs } from "shared/constants/springs";
import { Image } from "../../library/image";

export const Vignette = ({ open }: { open: boolean }) => {
	const [transition, transitionMotion] = useMotion(0);

	useEffect(() => {
		if (open) {
			transitionMotion.spring(1, springs.molasses);
		} else {
			transitionMotion.spring(0, springs.molasses);
		}
	}, [open]);

	return (
		<Image
			backgroundTransparency={1}
			image={images.ui.misc.vignette}
			imageColor={palette.white}
			imageTransparency={lerpBinding(transition, 1, 0.25)}
			scaleType="Crop"
			size={new UDim2(1, 0, 1, 0)}
		/>
	);
};
