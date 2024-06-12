import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectActiveObservingObjective } from "client/store/menu";
import { useRem } from "../../hooks";
import { ObjectiveMarker } from "./objective-marker";

export function ObjectiveProvider() {
	const rem = useRem();

	const activeObservingObjective = useSelector(selectActiveObservingObjective);

	return <>{activeObservingObjective && <ObjectiveMarker objective={activeObservingObjective} />}</>;
}
