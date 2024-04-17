export * from "./clan";
export * from "./objectives";
export * from "./perks";
export * from "./shop";

export interface MenuPageProps {
	visible: boolean;
	onClose: () => void;
}
