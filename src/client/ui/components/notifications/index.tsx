import { useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { Notification } from "client/store/notifications";
import { useMotion, useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";

export interface NotificationProps {
	notification: Notification;
}

export function Notification({ notification }: NotificationProps) {
	const rem = useRem();

	const [opacity, opacityMotion] = useMotion(0);
	const [position, positionMotion] = useMotion(new UDim2(1, rem(5), 1, -rem(10)));

	useMountEffect(() => {
		positionMotion.tween(new UDim2(1, rem(-15), 1, -rem(10)), {
			time: 0.5,
		});
	});

	return (
		<>
			<Frame
				backgroundTransparency={opacity}
				position={position}
				size={UDim2.fromOffset(rem(10), rem(3.5))}
			></Frame>
		</>
	);
}
