/**
 * @author </Nexus_Prime>
 * @description In case needed help to understand, go to https://nexusprime.vercel.app
 */

import { lerpBinding } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { useMotion } from "client/ui/hooks";
import { Notification, useNotification } from "client/ui/hooks/use-notification";
import { fonts } from "shared/constants/fonts";
import { springs } from "shared/constants/springs";

export function Notification({ title, content }: Notification) {
	const [opacity, opacityMotion] = useMotion(1);
	// not workin :(
	const [leftTransition, leftTransitionMotion] = useMotion(0);

	Roact.useEffect(() => {
		opacityMotion.spring(0, springs.gentle);
		leftTransitionMotion.spring(1, springs.world);
	}, []);

	return (
		<frame
			Position={lerpBinding(leftTransition, UDim2.fromScale(5, 0), UDim2.fromScale(0, 0))}
			Size={new UDim2(0, 150, 0, 50)}
			BackgroundColor3={Color3.fromHex("#141414")}
			BorderSizePixel={6}
			BorderColor3={Color3.fromHex("#3a4a5e")}
			BackgroundTransparency={opacity}
		>
			<textlabel
				Text={title}
				TextSize={20}
				Position={UDim2.fromScale(0.5, 0.2)}
				TextColor={BrickColor.White()}
				FontFace={fonts.gothic.regular}
			/>
			<textlabel
				Text={content}
				TextSize={15}
				Position={UDim2.fromScale(0.5, 0.6)}
				TextColor={BrickColor.White()}
				FontFace={fonts.gothic.regular}
			/>
		</frame>
	);
}

/**
 * If you aren't using Roact component, use "NotificationsHandler" in client/uiComponents instead "useNotification"
 */
export function Notifications() {
	const { notifications } = useNotification();

	const mappedNotifications = notifications.map((n) => <Notification {...n} />);

	return (
		<frame Position={UDim2.fromScale(0.88, 0.97)}>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Bottom}
				Padding={new UDim(0, 20)}
			/>
			{mappedNotifications}
		</frame>
	);
}
