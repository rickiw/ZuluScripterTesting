import { useSelector } from "@rbxts/react-reflex";
import Roact, { useBinding } from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { useMotion } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { springs } from "shared/constants/springs";
import { FirearmState } from "shared/constants/weapons/state";
import { selectWeapon } from "shared/store/combat";

export function WeaponProvider() {
	const weapon = useSelector(selectWeapon(Players.LocalPlayer.UserId));
	const [fireMode, setFireMode] = useBinding("Safety");
	const [magazineHolding, setMagazineHolding] = useBinding(0);
	const [bullets, setBullets] = useBinding(0);
	const [reloading, setReloading] = useBinding(false);
	const [transparency, setTransparencyMotion] = useMotion(1);
	const [yPosition, setYPositionMotion] = useMotion(0.5);
	let reloadImminent = false;
	const fireFxInMotion = false;

	// clientStore.subscribe(selectWeapon(Players.LocalPlayer.UserId), (newWeapon) => {
	// 	setTransparencyMotion.spring(newWeapon === undefined ? 1 : 0, springs.stiff);
	// 	if (newWeapon && isFirearmState(newWeapon)) {
	// 		updateWeaponState(newWeapon);
	// 	}
	// });

	const updateWeaponState = (newWeapon: FirearmState) => {
		setFireMode(newWeapon.mode);
		setReloading(newWeapon.reloading);
		if (newWeapon.cooldown && !fireFxInMotion) {
			setYPositionMotion.set(0.5 + math.random(-0.2, 0.2));
			setYPositionMotion.spring(0.5, springs.gentle);
		}
		if (!reloadImminent && newWeapon.reloading) reloadImminent = true;
		if (newWeapon.magazine.holding > magazineHolding.getValue() && reloadImminent) {
			reloadWeapon(newWeapon);
		} else {
			updateWeaponAmmo(newWeapon);
		}
	};

	const reloadWeapon = (newWeapon: FirearmState) => {
		while (reloading.getValue()) wait();
		setYPositionMotion.spring(1.5, springs.stiff);
		setTransparencyMotion.spring(1, springs.stiff);
		wait(0.4);
		updateWeaponAmmo(newWeapon);
		setTransparencyMotion.spring(0, springs.stiff);
		reloadImminent = false;
		setYPositionMotion.set(-1.5);
		setYPositionMotion.spring(0.5, springs.stiff);
	};

	const updateWeaponAmmo = (newWeapon: FirearmState) => {
		setMagazineHolding(newWeapon.magazine.holding);
		setBullets(newWeapon.bullets);
	};

	return (
		<Frame
			position={UDim2.fromScale(0.8, 0.9)}
			anchorPoint={new Vector2(0.5, 0.5)}
			size={UDim2.fromScale(0.35, 0.2)}
			backgroundTransparency={1}
			clipsDescendants={false}
		>
			<Text
				text={weapon === undefined ? `` : `[ ${magazineHolding.getValue()} / ${bullets.getValue()} ]`}
				position={yPosition.map((x) => UDim2.fromScale(0.5, x))}
				anchorPoint={new Vector2(0.5, 0.4)}
				size={UDim2.fromScale(1, 0.9)}
				textScaled={true}
				textColor={Color3.fromRGB(255, 255, 255)}
				font={Font.fromEnum(Enum.Font.MontserratBlack)}
				textTransparency={transparency}
				zIndex={1}
			/>

			<Text
				text={`${fireMode.getValue().upper()}`}
				font={Font.fromEnum(Enum.Font.MontserratBlack)}
				textTransparency={transparency}
				zIndex={1}
				textColor={Color3.fromRGB(128, 128, 128)}
				textScaled={true}
				size={UDim2.fromScale(0.9, 0.275)}
				position={UDim2.fromScale(0.075, 0.1)}
				textXAlignment={"Left"}
			/>
		</Frame>
	);
}
