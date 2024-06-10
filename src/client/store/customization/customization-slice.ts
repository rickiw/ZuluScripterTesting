import { CharacterRigR15 } from "@rbxts/promise-character";
import { createProducer } from "@rbxts/reflex";
import { IModification, WeaponBase } from "shared/constants/weapons";

export type RobloxAsset = {
	name: string;
	assetID: number;
};

export const FaceOptions: RobloxAsset[] = [
	{ name: "Smile", assetID: 144080495 },
	{ name: "Freckles", assetID: 12145059 },
	{ name: "Smiling Girl", assetID: 209713952 },
	{ name: "Err", assetID: 20418518 },
	{ name: "Not Sure If…", assetID: 168332209 },
	{ name: "Skeptic", assetID: 31117192 },
	{ name: "Serious Scar Face", assetID: 255828374 },
	{ name: "Sigmund", assetID: 21311520 },
];

export const HairOptions: RobloxAsset[] = [
	{ name: "Stylized Black Hair", assetID: 4212534746 },
	{ name: "Stylized Brown Hair", assetID: 4095965075 },
	{ name: "Stylized Blonde Hair", assetID: 4095982813 },
	{ name: "Ginger Styled Back Slick", assetID: 13730508248 },
	{ name: "Trooper Hair", assetID: 10006185533 },
	{ name: "High Updo Bun", assetID: 9476658922 },
	{ name: "Aesthetic Y2K Bun", assetID: 10423330797 },
	{ name: "Black Fluffy Middle Swept Hair", assetID: 10323360626 },
	{ name: "Short Cut in Cocoa", assetID: 6494532954 },
	{ name: "Brown Luscious Wavy Hair", assetID: 12206571457 },
	{ name: "Workclock Headphones", assetID: 172309919 },
	{ name: "Clockwork's Shades", assetID: 11748356 },
	{ name: "Midnight shades", assetID: 30331986 },
	{ name: "Master of Disguise", assetID: 987022351 },
	{ name: "Circle Gray Framed Glasses", assetID: 5063562714 },
];

export type CharacterOptions = {
	skinColor: Color3;
	face: number;
	hair: number[];
};

export interface CustomizationState {
	isOpen: boolean;
	customizationPage: "character" | "weapon";
	characterSelectedPage: "character" | "teams" | "uniform" | "armor";
	weaponSelectedPage: "primary" | "secondary" | "melee" | "mods";
	weapon: {
		selectedWeapon: WeaponBase | undefined;
		selectedModificationMount: BasePart | undefined;
		modificationPreviews: IModification[];
	};
	character: CharacterOptions;
	characterCustomizationModel?: CharacterRigR15;
	weaponPageSubtitles: Record<CustomizationState["weaponSelectedPage"], string>;
	characterPageSubtitles: Record<CustomizationState["characterSelectedPage"], string>;
	weaponPages: CustomizationState["weaponSelectedPage"][];
	characterPages: CustomizationState["characterSelectedPage"][];
}

const initialState: CustomizationState = {
	isOpen: false,
	customizationPage: "character",
	characterSelectedPage: "character",
	weaponSelectedPage: "primary",
	weapon: {
		selectedWeapon: undefined,
		selectedModificationMount: undefined,
		modificationPreviews: [],
	},
	character: {
		skinColor: Color3.fromHex("#C69C6D"),
		face: 144080495,
		hair: [4212534746],
	},
	characterCustomizationModel: undefined,
	weaponPageSubtitles: {
		primary: "Firearm",
		secondary: "Sidearm",
		melee: "Melee Weapon",
		mods: "Attachments",
	},
	characterPageSubtitles: {
		character: "Character",
		teams: "Teams",
		uniform: "Uniform",
		armor: "Armor",
	},
	weaponPages: ["primary", "secondary", "melee", "mods"],
	characterPages: ["teams", "character", "uniform", "armor"],
};

export const customizationSlice = createProducer(initialState, {
	setCustomizationOpen: (state, isOpen: boolean) => ({ ...state, isOpen }),
	setCustomizationPage: (state, customizationPage: "character" | "weapon") => ({
		...state,
		customizationPage,
	}),
	setSelectedWeapon: (state, selectedWeapon: WeaponBase | undefined) => ({
		...state,
		weapon: {
			...state.weapon,
			selectedWeapon,
		},
	}),
	setCharacterSkinColor: (state, skinColor: Color3) => ({
		...state,
		character: {
			...state.character,
			skinColor,
		},
	}),
	setCharacterFace: (state, face: number) => ({
		...state,
		character: {
			...state.character,
			face,
		},
	}),
	setCharacterHair: (state, hair: number[]) => ({
		...state,
		character: {
			...state.character,
			hair,
		},
	}),
	setCharacterCustomizationModel: (state, characterCustomizationModel: CharacterRigR15 | undefined) => ({
		...state,
		characterCustomizationModel,
	}),
	setCharacterCustomizationPage: (state, characterSelectedPage: CustomizationState["characterSelectedPage"]) => ({
		...state,
		characterSelectedPage,
	}),
	setWeaponCustomizationPage: (state, weaponSelectedPage: CustomizationState["weaponSelectedPage"]) => ({
		...state,
		weaponSelectedPage,
	}),
	setSelectedModificationMount: (state, selectedModificationMount: BasePart | undefined) => ({
		...state,
		weapon: {
			...state.weapon,
			selectedModificationMount,
		},
	}),
	addModificationPreview: (state, modification: IModification) => ({
		...state,
		weapon: {
			...state.weapon,
			modificationPreviews: [...state.weapon.modificationPreviews, modification],
		},
	}),
	removeModificationPreview: (state, modification: IModification) => ({
		...state,
		weapon: {
			...state.weapon,
			modificationPreviews: state.weapon.modificationPreviews.filter(
				(preview) => preview.name !== modification.name,
			),
		},
	}),
	toggleModificationPreview: (state, modification: IModification) => {
		const hasPreview = state.weapon.modificationPreviews.some((preview) => preview.name === modification.name);
		return {
			...state,
			weapon: {
				...state.weapon,
				modificationPreviews: hasPreview
					? state.weapon.modificationPreviews.filter((preview) => preview.name !== modification.name)
					: [...state.weapon.modificationPreviews, modification],
			},
		};
	},
	resetWeaponPreview: (state) => ({
		...state,
		weapon: {
			...state.weapon,
			selectedModificationMount: undefined,
			modificationPreviews: [],
		},
	}),
});
