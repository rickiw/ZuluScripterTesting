import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectCharacterCustomizationPage, selectCharacterCustomizationPageIndex } from "client/store/customization";
import { useRem } from "client/ui/hooks";
import { images } from "shared/assets/images";
import { SCPTab, SCPTabs } from "../../scp";

export function CharacterCustomizationRow() {
	const rem = useRem();
	const selectedPage = useSelector(selectCharacterCustomizationPage);
	const selectedIndex = useSelector(selectCharacterCustomizationPageIndex);

	return (
		<SCPTabs
			size={new UDim2(1, 0, 0, rem(4.5))}
			position={UDim2.fromOffset(rem(0), rem(7.5))}
			selectedPage={selectedPage}
			selectedIndex={selectedIndex}
			fat
		>
			<SCPTab
				page="TEAMS"
				index={1}
				rectSize={new Vector2(128, 128)}
				rectOffset={new Vector2(0, 0)}
				selectedPage={selectedPage.upper()}
				onClick={() => {
					// clientStore.setCharacterCustomizationPage("teams");
				}}
				icon={images.ui.icons.character_customization_icons}
			/>
			<SCPTab
				page="CHARACTER"
				index={2}
				rectSize={new Vector2(128, 128)}
				rectOffset={new Vector2(128, 0)}
				selectedPage={selectedPage.upper()}
				onClick={() => {
					// clientStore.setCharacterCustomizationPage("character");
				}}
				icon={images.ui.icons.character_customization_icons}
			/>
			<SCPTab
				page="UNIFORM"
				index={3}
				rectSize={new Vector2(128, 128)}
				rectOffset={new Vector2(0, 128)}
				selectedPage={selectedPage.upper()}
				onClick={() => {
					// clientStore.setCharacterCustomizationPage("uniform");
				}}
				icon={images.ui.icons.character_customization_icons}
			/>
			<SCPTab
				page="ARMOR"
				index={4}
				rectSize={new Vector2(128, 128)}
				rectOffset={new Vector2(128, 128)}
				selectedPage={selectedPage.upper()}
				onClick={() => {
					// clientStore.setCharacterCustomizationPage("armor");
				}}
				icon={images.ui.icons.character_customization_icons}
			/>
		</SCPTabs>
	);
}
