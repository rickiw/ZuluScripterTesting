import Roact from "@rbxts/roact";
import { buttons } from "../button-row";
import { ClanPage } from "./clan";
import { ObjectivesPage } from "./objectives";
import { PerksPage } from "./perks";
import { ShopPage } from "./shop";

interface MenuPageProps {
	menuPage: (typeof buttons)[number];
}

export function MenuPage({ menuPage }: MenuPageProps) {
	return (
		<>
			{menuPage === "Clan" && <ClanPage />}
			{menuPage === "Objectives" && <ObjectivesPage />}
			{menuPage === "Perks" && <PerksPage />}
			{menuPage === "Shop" && <ShopPage />}
		</>
	);
}
