import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { clientStore } from "client/store";
import {
	selectActiveSection,
	selectActiveSectionIndex,
	selectTerminalIsOpen,
	selectTerminalSections,
} from "client/store/terminal";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { springs } from "shared/constants/springs";
import { AudioPage, DocumentsPage, HomePage, PowerPage } from "../components/os";
import { SCPClock, SCPWindow } from "../components/scp";
import { SCPTab, SCPTabs } from "../components/scp/tabs/scp-tabs";
import { useMotion, useRem } from "../hooks";
import { Image } from "../library/image";
import { Text } from "../library/text";

export const OSProvider = () => {
	const rem = useRem();
	const isOSOpen = useSelector(selectTerminalIsOpen);
	const sections = useSelector(selectTerminalSections);
	const activeSection = useSelector(selectActiveSection);
	const activeSectionIndex = useSelector(selectActiveSectionIndex);
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion(1);

	useEffect(() => {
		backgroundTransparencyMotion.spring(isOSOpen ? 0.25 : 1, springs.gentle);
	}, [isOSOpen]);

	return (
		<SCPWindow
			backgroundTransparency={backgroundTransparency}
			size={new UDim2(0, rem(82), 0, rem(43))}
			isOpen={isOSOpen}
			onClose={() => {
				clientStore.setTerminalOpen(false);
			}}
		>
			<Image
				imageTransparency={backgroundTransparency}
				size={UDim2.fromOffset(rem(5), rem(5))}
				position={UDim2.fromOffset(rem(1), rem(0.5))}
				image={images.ui.misc.foundationlogo}
			/>
			<Text
				text="OPERATING SYSTEM"
				position={UDim2.fromOffset(rem(7), rem(2))}
				size={UDim2.fromOffset(rem(30), rem(2.5))}
				textColor={Color3.fromRGB(255, 255, 255)}
				textSize={rem(2.5)}
				backgroundTransparency={1}
				textTransparency={backgroundTransparency}
				textWrapped={true}
				textXAlignment="Left"
				textYAlignment="Center"
				font={fonts.inter.bold}
			/>
			<SCPTabs
				position={UDim2.fromOffset(rem(0), rem(5.25))}
				selectedPage={activeSection}
				selectedIndex={activeSectionIndex}
			>
				{sections.map((section, index) => {
					let offset = new Vector2(0, 0);
					switch (section) {
						case "home":
							offset = new Vector2(128, 0);
							break;
						case "document":
							offset = new Vector2(128, 128);
							break;
						case "audio":
							offset = new Vector2(0, 0);
							break;
						case "power":
							offset = new Vector2(0, 128);
							break;
					}
					return (
						<SCPTab
							rectSize={new Vector2(128, 128)}
							rectOffset={offset}
							page={section}
							index={index + 1}
							icon={images.ui.icons.os_icons}
							selectedPage={activeSection}
							onClick={() => {
								clientStore.setActiveSection(section);
							}}
						/>
					);
				})}
			</SCPTabs>
			<HomePage backgroundTransparency={backgroundTransparency} />
			<DocumentsPage backgroundTransparency={backgroundTransparency} />
			<AudioPage backgroundTransparency={backgroundTransparency} />
			<PowerPage backgroundTransparency={backgroundTransparency} />
			<SCPClock
				position={new UDim2(1, -rem(1), 1, -rem(1))}
				anchorPoint={new Vector2(1, 1)}
				size={UDim2.fromOffset(rem(30), rem(1.5))}
				textTransparency={backgroundTransparency.map((transparency) => math.clamp(transparency + 0.25, 0, 1))}
			/>
		</SCPWindow>
	);
};
