import { createContext } from "@rbxts/roact";

export const SelectedWeaponContext = createContext<[weapon: string, setWeapon: (weapon: string) => void]>([
	"",
	() => {},
]);
