import { blend, composeBindings, map, useLifetime } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { selectExhausted, selectStamina } from "client/store/character";
import { palette } from "shared/constants/palette";
import { springs } from "shared/constants/springs";
import { useMotion, useRem } from "../hooks";
import { CanvasGroup } from "./canvas-group";
import { Frame } from "./frame";

export function Stamina() {
	const rem = useRem();
	const timer = useLifetime();

	const exhausted = useSelector(selectExhausted);
	const staminaState = useSelector(selectStamina);

	const [exhaustion, exhaustionMotion] = useMotion(0);
	const [stamina, staminaMotion] = useMotion(staminaState);
	const [transparency, transparencyMotion] = useMotion(1);

	const exhaustedFlash = composeBindings(exhaustion, timer, (e, t) => {
		const transparency = 1 - e;
		const flash = map(math.cos(t * 10), -1, 1, 0.5, 1);
		return blend(transparency, flash);
	});

	useEffect(() => {
		staminaMotion.spring(staminaState);
		transparencyMotion.spring(staminaState < 0.9 ? 0 : 1, springs.molasses);
	}, [staminaState]);

	useEffect(() => {
		exhaustionMotion.spring(exhausted ? 1 : 0);
	}, [exhausted]);

	return (
		<CanvasGroup
			groupTransparency={transparency}
			backgroundTransparency={1}
			anchorPoint={new Vector2(1, 1)}
			size={new UDim2(0, rem(15), 0, rem(1))}
			position={new UDim2(1, -rem(2), 1, -rem(2))}
		>
			<Frame
				key="background"
				backgroundColor={palette.black}
				backgroundTransparency={0.5}
				cornerRadius={new UDim(0, 2)}
				size={new UDim2(1, 0, 1, 0)}
			/>

			<Frame
				key="exhaustion"
				backgroundColor={Color3.fromRGB(255, 0, 0)}
				backgroundTransparency={exhaustedFlash}
				cornerRadius={new UDim(0, 2)}
				size={new UDim2(1, 0, 1, 0)}
			/>

			<Frame
				key="stamina"
				backgroundColor={palette.white}
				cornerRadius={new UDim(0, 2)}
				size={stamina.map((s) => new UDim2(s, 0, 1, 0))}
			/>
		</CanvasGroup>
	);
}
