import { useEventListener } from "@rbxts/pretty-react-hooks";
import Roact, { useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { useRem } from "client/ui/hooks";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { Text, TextProps } from "../../text";

export const SCPClock = (props: TextProps) => {
	const rem = useRem();
	const [time, setTime] = useState(DateTime.now().FormatLocalTime("ddd MMM DD hh:mm A", "en-us").upper());
	useEventListener(RunService.Heartbeat, () => {
		setTime(DateTime.now().FormatLocalTime("ddd MMM DD hh:mm A", "en-us").upper());
	});

	return (
		<Text
			text={time}
			position={props.position}
			anchorPoint={props.anchorPoint}
			size={UDim2.fromOffset(rem(30), rem(1.5))}
			textColor={palette.subtext1}
			textSize={rem(1.5)}
			textTransparency={props.textTransparency}
			backgroundTransparency={1}
			textWrapped={true}
			textXAlignment="Right"
			textYAlignment="Center"
			font={fonts.inter.extra}
		/>
	);
};
