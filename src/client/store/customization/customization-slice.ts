import { createProducer } from "@rbxts/reflex";
import { CharacterOptions, CharacterOutfit } from "shared/constants/character";
import { IModification, WeaponBase } from "shared/constants/weapons";
import { TeamAbbreviation } from "shared/store/teams";

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
	weaponPageSubtitles: Record<CustomizationState["weaponSelectedPage"], string>;
	characterPageSubtitles: Record<CustomizationState["characterSelectedPage"], string>;
	weaponPages: CustomizationState["weaponSelectedPage"][];
	characterPages: CustomizationState["characterSelectedPage"][];
}

export type Armor = {
	team: TeamAbbreviation;
	armorName: string;
	armorType: string;
};

export const Armors = {
	SD: [
		{
			team: "SD",
			armorName: "Cadet",
			armorType: "Type",
		},
		{
			team: "SD",
			armorName: "Guard",
			armorType: "Type",
		},
		{
			team: "SD",
			armorName: "Specialist",
			armorType: "Type",
		},
		{
			team: "SD",
			armorName: "Corporal",
			armorType: "Type",
		},
		{
			team: "SD",
			armorName: "Sergeant",
			armorType: "Type",
		},
		{
			team: "SD",
			armorName: "Lietenant",
			armorType: "Type",
		},
		{
			team: "SD",
			armorName: "Captain",
			armorType: "Type",
		},
		{
			team: "SD",
			armorName: "Major",
			armorType: "Type",
		},
		{
			team: "SD",
			armorName: "SIU",
			armorType: "Type",
		},
	],
} satisfies {
	[rank: string]: Armor[];
};

export type Outfit = {
	team: TeamAbbreviation;
	uniformName: string;
	uniformType: string;
	shirt: number;
	pants: number;
};

export const Outfits = {
	"CLASS-D": [
		{ team: "CLASS-D", uniformName: "CLASS-D", uniformType: "Type", shirt: 13958124520, pants: 13958120032 },
	],
	"LEVEL-0": [{ team: "FP", uniformName: "LEVEL-0", uniformType: "Type", shirt: 14035981578, pants: 14035990968 }],
	"LEVEL-1": [{ team: "FP", uniformName: "LEVEL-1", uniformType: "Type", shirt: 14149505242, pants: 14148566810 }],
	"LEVEL-2": [{ team: "FP", uniformName: "LEVEL-2", uniformType: "Type", shirt: 14149499217, pants: 14148566810 }],
	"LEVEL-3": [{ team: "FP", uniformName: "LEVEL-3", uniformType: "Type", shirt: 14149499217, pants: 14148566810 }],
	"LEVEL-4": [{ team: "FP", uniformName: "LEVEL-4", uniformType: "Type", shirt: 1314469210, pants: 1314471341 }],
	SD: [
		{
			team: "SD",
			uniformName: "SECURITY DEPARTMENT",
			uniformType: "Type",
			shirt: 17057280811,
			pants: 14148584524,
		},
	],
	SCD: [
		{
			team: "SCD",
			uniformName: "JUNIOR RESEARCHER",
			uniformType: "Type",
			shirt: 14149517854,
			pants: 14149570399,
		},
		{
			team: "SCD",
			uniformName: "SENIOR RESEARCHER",
			uniformType: "Type",
			shirt: 14149566482,
			pants: 14149572935,
		},
	],
	MD: [
		{
			team: "MD",
			uniformName: "MEDICAL DEPARTMENT",
			uniformType: "Type",
			shirt: 6293707206,
			pants: 6293708641,
		},
	],
	ETHICS: [
		{
			team: "E&T",
			uniformName: "ETHICS COMMITTEE",
			uniformType: "Type",
			shirt: 10921345151,
			pants: 10921346256,
		},
	],
	DEA: [
		{
			team: "DEA",
			uniformName: "DEA",
			uniformType: "Type",
			shirt: 13249616862,
			pants: 13249633946,
		},
	],
	AD: [
		{
			team: "AD",
			uniformName: "ADMIN",
			uniformType: "Type",
			shirt: 13249616862,
			pants: 13249633946,
		},
	],
	CHAOS: [
		{
			team: "CHAOS",
			uniformName: "CHAOS INSURGENCY",
			uniformType: "Type",
			shirt: 14148686271,
			pants: 17057302926,
		},
	],
} satisfies {
	[rank: string]: Outfit[];
};

const initialState: CustomizationState = {
	isOpen: false,
	customizationPage: "character",
	characterSelectedPage: "teams",
	weaponSelectedPage: "mods",
	weapon: {
		selectedWeapon: undefined,
		selectedModificationMount: undefined,
		modificationPreviews: [],
	},
	character: {
		skinColor: Color3.fromHex("#C69C6D"),
		face: 144080495,
		hair: [4212534746],
		outfit: Outfits["CLASS-D"][0],
		armor: undefined,
	},
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
	setCharacterOptions: (state, character: CharacterOptions) => ({
		...state,
		character,
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
	setCharacterOutfit: (state, outfit: CharacterOutfit) => ({
		...state,
		character: {
			...state.character,
			outfit,
		},
	}),
	setCharacterArmor: (state, armor: string | undefined) => ({
		...state,
		character: {
			...state.character,
			armor,
		},
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
