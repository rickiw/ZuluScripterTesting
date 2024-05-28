import { OnStart, Service } from "@flamework/core";
import { Functions } from "server/network";

// -- Constants
const WAIT_TIME = 30;
const TRAVEL_TIME = 30;

// -- Services
@Service()
export class CableCarService implements OnStart {
	startTime: number = os.time() + WAIT_TIME;

	onStart() {
		Functions.getCableCarInfo.setCallback(() => this.onInfoRequest());
		print("started");
	}

	/**
	 * Return information about cable car.
	 */
	onInfoRequest() {
		return [this.startTime, WAIT_TIME, TRAVEL_TIME];
	}
}
