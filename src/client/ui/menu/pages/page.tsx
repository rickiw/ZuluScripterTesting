import Roact, { useEffect } from "@rbxts/roact";
import { useMotion } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { springs } from "shared/constants/springs";
import { buttons } from "../button-row";
import { ClanPage } from "./clan";
import { ObjectivesPage } from "./objectives";
import { PerksPage } from "./perks";
import { ShopPage } from "./shop";

interface MenuPageProps {
	menuPage: (typeof buttons)[number];
}

export function MenuPage({ menuPage }: MenuPageProps) {
	const [fade, fadeMotion] = useMotion(1);

	useEffect(() => {
		fadeMotion.spring(0, springs.gentle);
		fadeMotion.onComplete((value) => {
			if (value === 0) fadeMotion.spring(1, springs.gentle);
		});
	}, [menuPage]);

	return (
		<Frame backgroundTransparency={1} backgroundColor={Color3.fromRGB(0, 0, 0)} size={UDim2.fromScale(1, 1)}>
			{menuPage === "Clan" && <ClanPage />}
			{menuPage === "Objectives" && <ObjectivesPage />}
			{menuPage === "Perks" && <PerksPage />}
			{menuPage === "Shop" && <ShopPage />}
		</Frame>
	);
}
