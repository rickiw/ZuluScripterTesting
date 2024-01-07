import { useUpdateEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useMemo } from "@rbxts/roact";
import { springs } from "shared/constants/springs";
import { useMotion } from "./use-motion";

export interface ButtonAnimation {
	/**
	 * An underdamped spring. `-1` is fully hovered, `0` is neutral, and `1` is
	 * fully pressed. Values outside of this range are possible.
	 */
	readonly position: Roact.Binding<number>;
	/**
	 * A critically damped spring that is `1` when the button is pressed.
	 */
	readonly press: Roact.Binding<number>;
	/**
	 * A critically damped spring that is `1` when the button is hovered.
	 */
	readonly hover: Roact.Binding<number>;
	/**
	 * Same as `hover`, but `pressed` must be `false`.
	 */
	readonly hoverOnly: Roact.Binding<number>;
}

/**
 * Returns a `ButtonAnimation` object that can be used to animate a button.
 * The values provided by the object are:
 *
 * - `position`: An underdamped spring. `-1` is fully hovered, `0` is neutral,
 *  and `1` is fully pressed. Values outside of this range are possible.
 * - `press`: A critically damped spring that is `1` when the button is pressed.
 * - `hover`: A critically damped spring that is `1` when the button is hovered.
 * - `hoverExclusive`: Same as `hover`, but `pressed` must also be `false`.
 *
 * @param pressedState Whether the button is pressed.
 * @param hoveredState Whether the button is hovered.
 * @returns A `ButtonAnimation` object.
 */
export function useButtonAnimation(pressedState: boolean, hoveredState: boolean): ButtonAnimation {
	const [press, pressMotion] = useMotion(0);
	const [hover, hoverMotion] = useMotion(0);
	const [hoverExclusive, hoverExclusiveMotion] = useMotion(0);
	const [position, positionMotion] = useMotion(0);

	useUpdateEffect(() => {
		pressMotion.spring(pressedState ? 1 : 0, springs.bubbly);
		hoverExclusiveMotion.spring(hoveredState && !pressedState ? 1 : 0, springs.bubbly);
	}, [pressedState, hoveredState]);

	useUpdateEffect(() => {
		hoverMotion.spring(hoveredState ? 1 : 0, springs.bubbly);
	}, [hoveredState]);

	useUpdateEffect(() => {
		if (pressedState) {
			// hovered -> pressed
			positionMotion.spring(1, springs.bubbly);
		} else if (hoveredState) {
			// pressed -> hovered
			positionMotion.spring(-1, { ...springs.bubbly, impulse: -0.1 });
		} else {
			// pressed -> unhovered, but 'hover' was not true
			positionMotion.spring(0, { ...springs.bubbly, impulse: -0.07 });
		}
	}, [pressedState]);

	useUpdateEffect(() => {
		if (hoveredState) {
			// unhovered -> hovered
			positionMotion.spring(-1, springs.bubbly);
		} else {
			// hovered -> unhovered
			positionMotion.spring(0, springs.bubbly);
		}
	}, [hoveredState]);

	return useMemo<ButtonAnimation>(() => {
		return {
			press,
			hover: hover.map((t) => math.clamp(t, 0, 1)),
			hoverOnly: hoverExclusive.map((t) => math.clamp(t, 0, 1)),
			position,
		};
	}, []);
}
