import Roact, { useState } from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Separator } from "client/ui/library/separator";
import { GhostButton } from "../ghost-button";
import { StyledMenuButton } from "../styled-button";
import { StyledDropdownButton } from "../styled-dropdown-button";
import { OutlineCornerEffect } from "./corner-effect";

const headerButtons = ["CHARACTER", "ITEMS", "STORE"] as const;
const characterButtons = ["TEAM", "SKIN", "HAIR", "FACE", "OUTFIT", "ACCESSORIES", "ARMOR"] as const;
const itemButtons = ["PRIMARY", "SECONDARY", "KEYCARDS", "EQUIPMENT"] as const;

export function CharacterCustomization() {
	const rem = useRem();

	const [page, setPage] = useState<(typeof headerButtons)[number]>("CHARACTER");
	const [openDropdown, setOpenDropdown] = useState("");

	return (
		<Frame
			size={UDim2.fromScale(1, 1)}
			position={UDim2.fromScale(0, 0)}
			backgroundTransparency={0.95}
			backgroundColor={Color3.fromRGB(0, 0, 0)}
		>
			<OutlineCornerEffect />

			{headerButtons.map((button, index) => (
				<>
					<StyledMenuButton
						text={button}
						size={UDim2.fromOffset(rem(12.5), rem(2.5))}
						position={UDim2.fromOffset(rem(2.5) + rem(index * 14), rem(1))}
						clicked={() => setPage(button)}
					/>
					{index !== headerButtons.size() - 1 && (
						<Separator
							position={UDim2.fromOffset(rem(15.5) + rem(index * 14), rem(0.5))}
							size={UDim2.fromOffset(5, rem(3.5))}
						/>
					)}
				</>
			))}

			<Frame backgroundTransparency={1} size={UDim2.fromScale(1, 0.9)} position={UDim2.fromScale(0, 0.1)}>
				{page === "CHARACTER" && (
					<>
						{characterButtons.map((button, index) => (
							<>
								<StyledDropdownButton
									text={button}
									size={UDim2.fromOffset(rem(11), rem(2))}
									position={UDim2.fromOffset(rem(2.5) + rem(index * 13.5), rem(1))}
									items={[
										{ text: "Item1", clicked: () => {} },
										{ text: "Item2", clicked: () => {} },
										{ text: "Item3", clicked: () => {} },
									]}
									clicked={() => setOpenDropdown(openDropdown === button ? "" : button)}
									close={() => setOpenDropdown("")}
									open={openDropdown === button}
								/>
								{index !== characterButtons.size() - 1 && (
									<Separator
										position={UDim2.fromOffset(rem(14.5) + rem(index * 13.5), rem(0.5))}
										size={UDim2.fromOffset(5, rem(3))}
									/>
								)}
							</>
						))}

						<GhostButton
							anchorPoint={new Vector2(0.5, 0.5)}
							position={UDim2.fromScale(0.5, 0.9)}
							text="NEXT"
						/>
					</>
				)}
				{page === "ITEMS" && (
					<>
						{itemButtons.map((button, index) => (
							<>
								<StyledDropdownButton
									text={button}
									size={UDim2.fromOffset(rem(11), rem(2))}
									position={UDim2.fromOffset(rem(2.5) + rem(index * 13.5), rem(1))}
									items={[
										{ text: "Item1", clicked: () => {} },
										{ text: "Item2", clicked: () => {} },
										{ text: "Item3", clicked: () => {} },
									]}
									clicked={() => setOpenDropdown(openDropdown === button ? "" : button)}
									close={() => setOpenDropdown("")}
									open={openDropdown === button}
								/>
								{index !== itemButtons.size() - 1 && (
									<Separator
										position={UDim2.fromOffset(rem(14.5) + rem(index * 13.5), rem(0.5))}
										size={UDim2.fromOffset(5, rem(3))}
									/>
								)}
							</>
						))}

						<GhostButton
							anchorPoint={new Vector2(0.5, 0.5)}
							position={UDim2.fromScale(0.5, 0.9)}
							text="START"
						/>
					</>
				)}
			</Frame>
		</Frame>
	);
}
