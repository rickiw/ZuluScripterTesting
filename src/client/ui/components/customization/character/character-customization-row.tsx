import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectCharacterCustomizationPage, selectCharacterCustomizationPageIndex } from "client/store/customization";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { images } from "shared/assets/images";
import { SCPTab, SCPTabs } from "../../scp";
import { CharacterButtonRowButton } from "./character-button-row-button";

export function CharacterCustomizationRow() {
	const rem = useRem();
	const selectedPage = useSelector(selectCharacterCustomizationPage);
	const selectedIndex = useSelector(selectCharacterCustomizationPageIndex);

	return (
		<SCPTabs
			size={new UDim2(1, 0, 0, rem(4.5))}
			position={UDim2.fromOffset(rem(0), rem(5))}
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
					clientStore.setCharacterCustomizationPage("teams");
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
					clientStore.setCharacterCustomizationPage("character");
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
					clientStore.setCharacterCustomizationPage("uniform");
				}}
				icon={images.ui.icons.character_customization_icons}
			/>
			<SCPTab
				page="OTHER"
				index={4}
				rectSize={new Vector2(128, 128)}
				rectOffset={new Vector2(128, 128)}
				selectedPage={selectedPage.upper()}
				onClick={() => {
					clientStore.setCharacterCustomizationPage("armor");
				}}
				icon={images.ui.icons.character_customization_icons}
			/>
		</SCPTabs>
	);

	return (
		<>
			<Frame
				position={UDim2.fromOffset(rem(0), rem(10.25))}
				size={UDim2.fromOffset(rem(45), rem(4.75))}
				backgroundTransparency={1}
				zIndex={2}
			>
				<uigridlayout
					CellPadding={UDim2.fromOffset(rem(1), rem(1))}
					CellSize={UDim2.fromOffset(rem(6), rem(5))}
				/>
				<CharacterButtonRowButton title="TEAMS 01" page="teams" icon="group" selectedIcon="groupselected" />
				<CharacterButtonRowButton
					title="UNIFORM 02"
					page="character"
					icon="pencil"
					selectedIcon="pencilselected"
				/>
				<CharacterButtonRowButton title="UNIFORM 03" page="uniform" icon="shirt" selectedIcon="shirtselected" />
				<CharacterButtonRowButton title="N/A 04" page="armor" icon="vest" />
			</Frame>
			<Frame
				zIndex={1}
				backgroundColor={Color3.fromRGB(33, 38, 41)}
				size={UDim2.fromOffset(rem(45), rem(2))}
				position={UDim2.fromOffset(rem(0), rem(15.25))}
			/>
		</>
	);
}
