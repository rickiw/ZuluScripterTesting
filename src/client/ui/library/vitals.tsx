import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { selectHealth, selectHunger, selectThirst } from "client/store/vitals";
import { palette } from "shared/constants/palette";
import { useMotion, useRem } from "../hooks";
import { CanvasGroup } from "./canvas-group";
import { Frame } from "./frame";

export function Vitals() {
	const rem = useRem();

	const healthState = useSelector(selectHealth);
	const hungerState = useSelector(selectHunger);
	const thirstState = useSelector(selectThirst);

	const [health, healthMotion] = useMotion(healthState);
	const [hunger, hungerMotion] = useMotion(hungerState);
	const [thirst, thirstMotion] = useMotion(thirstState);

	useEffect(() => {
		healthMotion.spring(healthState);
		hungerMotion.spring(hungerState);
		thirstMotion.spring(thirstState);
	}, [healthState, hungerState, thirstState]);

	return (
		<CanvasGroup
			backgroundTransparency={1}
			anchorPoint={new Vector2(1, 1)}
			size={new UDim2(0, rem(15), 0, rem(5))}
			position={new UDim2(1, -rem(2), 1, -rem(2))}
		>
			<Frame
				key="background"
				backgroundTransparency={1}
				cornerRadius={new UDim(0, 2)}
				size={new UDim2(1, 0, 1, 0)}
			/>

			<Frame
				key="health"
				backgroundColor={palette.red}
				cornerRadius={new UDim(0, 10)}
				size={health.map((h) => new UDim2(h.value / h.max, 0, 0.3, 0))}
				position={new UDim2(0, 0, 0, 0)}
			/>

			<Frame
				key="hunger"
				backgroundColor={palette.yellow}
				cornerRadius={new UDim(0, 10)}
				size={hunger.map((h) => new UDim2(h.value / h.max, 0, 0.3, 0))}
				position={new UDim2(0, 0, 0.33, 0)}
			/>

			<Frame
				key="thirst"
				backgroundColor={palette.blue}
				cornerRadius={new UDim(0, 10)}
				size={thirst.map((t) => new UDim2(t.value / t.max, 0, 0.3, 0))}
				position={new UDim2(0, 0, 0.66, 0)}
			/>
		</CanvasGroup>
	);
}
