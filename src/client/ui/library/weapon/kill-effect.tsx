import { useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { UserInputService } from "@rbxts/services";
import { clientStore } from "client/store";
import { selectHasKilledEnemy } from "client/store/inventory";
import { useMotion } from "client/ui/hooks";
import { Frame } from "../frame";

const STARTING_TRANSPARENCY = 1;
const ENDING_TRANSPARENCY = 0.6;
const WAIT_TIME = 0.3;

export function KillEffect() {
	const [transparency, transparencyMotion] = useMotion(STARTING_TRANSPARENCY);

	useMountEffect(() => {
		UserInputService.InputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.LeftControl) {
				transparencyMotion.tween(ENDING_TRANSPARENCY, { time: WAIT_TIME });
			}
		});
		transparencyMotion.onComplete((value) => {
			if (value === ENDING_TRANSPARENCY) {
				transparencyMotion.tween(STARTING_TRANSPARENCY, { time: WAIT_TIME });
			}
		});
	});

	clientStore.subscribe(selectHasKilledEnemy, (hasKilledEnemy) => {
		if (hasKilledEnemy) {
			transparencyMotion.tween(ENDING_TRANSPARENCY, { time: WAIT_TIME });
			clientStore.setHasKilledEnemy(false);
		}
	});

	return (
		<>
			<Frame
				size={UDim2.fromScale(1, 1)}
				backgroundColor={Color3.fromRGB(13, 186, 0)}
				backgroundTransparency={transparency}
				zIndex={10}
			/>
		</>
	);
}
