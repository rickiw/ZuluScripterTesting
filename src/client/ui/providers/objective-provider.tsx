import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectActiveObjective } from "client/store/menu";
import { ObjectiveMarker } from "../components/objective/objective-marker";
import { useRem } from "../hooks";

export function ObjectiveProvider() {
	const rem = useRem();

	const activeObjective = useSelector(selectActiveObjective);

	return <>{activeObjective && <ObjectiveMarker objective={activeObjective} />}</>;
}
