import { useMountEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useMemo } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { clientStore } from "client/store";
import { selectHasKilledEnemy } from "client/store/inventory";
import { useMotion } from "client/ui/hooks";
import { Frame } from "../frame";

const STARTING_TRANSPARENCY = 1;
const ENDING_TRANSPARENCY = 0.6;
const WAIT_TIME = 0.75;

const DEBUG = !RunService.IsRunning();

export function KillEffect() {
	const [transparency, transparencyMotion] = useMotion(STARTING_TRANSPARENCY);
	const hasKilledEnemy = useSelector(selectHasKilledEnemy);

	useMountEffect(() => {
		transparencyMotion.onComplete((value) => {
			if (value === ENDING_TRANSPARENCY) {
				transparencyMotion.tween(STARTING_TRANSPARENCY, {
					time: WAIT_TIME * 5,
					style: Enum.EasingStyle.Exponential,
				});
			}
		});
	});

	useMemo(() => {
		if (hasKilledEnemy) {
			transparencyMotion.tween(ENDING_TRANSPARENCY, { time: WAIT_TIME });
			clientStore.setHasKilledEnemy(false);
		}
	}, [hasKilledEnemy]);

	return (
		<>
			<Frame
				size={UDim2.fromScale(1, 1)}
				backgroundColor={Color3.fromRGB(59, 153, 8)}
				backgroundTransparency={transparency}
				zIndex={10}
			>
				<uigradient
					Color={
						new ColorSequence([
							new ColorSequenceKeypoint(0, Color3.fromRGB(143, 143, 143)),
							new ColorSequenceKeypoint(0.5, Color3.fromRGB(0, 0, 0)),
							new ColorSequenceKeypoint(1, Color3.fromRGB(143, 143, 143)),
						])
					}
					Transparency={
						new NumberSequence([new NumberSequenceKeypoint(0, 0.5), new NumberSequenceKeypoint(1, 0.5)])
					}
				/>
			</Frame>
			{DEBUG && (
				<>
					<textbutton
						Text={"Play Kill Effect"}
						Event={{
							MouseButton1Click: () => {
								clientStore.setHasKilledEnemy(true);
							},
						}}
						Size={UDim2.fromScale(0.1, 0.1)}
						Position={UDim2.fromScale(0.05, 1)}
					/>
					<textbutton
						Text={"Play 3x Kill Effect"}
						Event={{
							MouseButton1Click: () => {
								task.spawn(() => {
									for (let i = 0; i < 3; i++) {
										clientStore.setHasKilledEnemy(true);
										task.wait(1);
									}
								});
							},
						}}
						Size={UDim2.fromScale(0.1, 0.1)}
						Position={UDim2.fromScale(0.15, 1)}
					/>
					<textbutton
						Text={"Play 10x Kill Effect"}
						Event={{
							MouseButton1Click: () => {
								task.spawn(() => {
									for (let i = 0; i < 10; i++) {
										clientStore.setHasKilledEnemy(true);
										task.wait(1);
									}
								});
							},
						}}
						Size={UDim2.fromScale(0.1, 0.1)}
						Position={UDim2.fromScale(0.25, 1)}
					/>
				</>
			)}
		</>
	);
}
