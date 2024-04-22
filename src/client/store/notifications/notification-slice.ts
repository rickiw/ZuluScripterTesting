/**
 * @author </Nexus_Prime>
 * @description In case needed help to understand, go to https://nexusprime.vercel.app
 */

import { createProducer } from "@rbxts/reflex";
import { Notification } from "client/ui/hooks/use-notification";

/**
 * Use notification-util.ts methods
 */
export const notificationSlice = createProducer(new Array<Notification>(), {
	setNotifications: (state, arg: Notification[] | ((state: Notification[]) => Notification[])) =>
		typeIs(arg, "function") ? arg(state) : arg,
});
