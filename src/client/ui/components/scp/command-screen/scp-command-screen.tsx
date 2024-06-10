import { useEventListener } from "@rbxts/pretty-react-hooks";
import Roact, { Ref, forwardRef, useEffect, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { useRem } from "client/ui/hooks";
import { Text, TextProps } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";

export interface SCPCommandScreenProps extends TextProps {}

const initialText = "system:~ LOGIN$ \n";

export const SCPCommandScreen = forwardRef((props: SCPCommandScreenProps, ref: Ref<TextLabel>) => {
	const [currentText, setCurrentText] = useState(initialText);
	const [lastUpdate, setLastUpdate] = useState(0);
	const [maxGraphemes, setMaxGraphemes] = useState(0);
	const [showCursor, setShowCursor] = useState(false);
	const rem = useRem();
	useEventListener(RunService.Heartbeat, () => {
		const graphemes = utf8.len(currentText);
		if (graphemes[0]) {
			if (maxGraphemes <= graphemes[0]) {
				setShowCursor(false);
				setLastUpdate(tick());
				const graphemes = utf8.len(currentText);
				if (graphemes[0]) {
					setMaxGraphemes(math.clamp(maxGraphemes + 1, 0, graphemes[0] + 1));
				}
			} else {
				if (tick() > lastUpdate + 0.5) {
					setLastUpdate(tick());
					setMaxGraphemes(graphemes[0] + 2);
					setShowCursor(!showCursor);
				}
			}
		}
	});
	useEffect(() => {
		if (props.text) {
			setCurrentText(currentText + "\n" + `> ${props.text}`);
		}
	}, [props.text]);
	return (
		<Text
			text={`${currentText}\n${showCursor ? "_" : " "}`}
			maxVisibleGraphemes={maxGraphemes}
			textSize={rem(1.5)}
			textColor={palette.text}
			font={fonts.robotoMono.regular}
			size={props.size}
			position={props.position}
			backgroundTransparency={1}
			textXAlignment="Left"
			textYAlignment="Top"
			ref={ref}
			textWrapped={false}
		/>
	);
});
