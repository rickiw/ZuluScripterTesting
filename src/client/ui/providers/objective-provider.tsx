import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectActiveObservingObjective } from "client/store/menu";
import { ObjectiveMarker } from "../components/objective/objective-marker";
import { useRem } from "../hooks";

export function ObjectiveProvider() {
	const rem = useRem();

	const activeObservingObjective = useSelector(selectActiveObservingObjective);

	return <>{activeObservingObjective && <ObjectiveMarker objective={activeObservingObjective} />}</>;
}
