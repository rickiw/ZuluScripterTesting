import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectIsPreviewingModification, selectModificationPreviews } from "client/store/customization";
import { Button } from "client/ui/library/button/button";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { IModification } from "shared/constants/weapons";
import { useRem } from "../hooks";
import { Frame } from "../library/frame";

export interface ModificationButtonProps {
	modification: IModification;
	previewImage: string;
}

export function ModificationButton(props: ModificationButtonProps) {
	const rem = useRem();

	const modificationPreviews = useSelector(selectModificationPreviews);
	const isModificationEquipped = useSelector(selectIsPreviewingModification(props.modification.name));

	return (
		<Button
			cornerRadius={new UDim(0, 8)}
			backgroundColor={Color3.fromRGB(52, 52, 52)}
			event={{
				MouseButton1Click: () => {
					if (
						modificationPreviews.find(
							(preview) =>
								preview.name !== props.modification.name && preview.type === props.modification.type,
						)
					) {
						return;
					}
					clientStore.toggleModificationPreview(props.modification);
				},
			}}
		>
			<Image
				image={props.previewImage}
				backgroundTransparency={1}
				position={UDim2.fromOffset(rem(25), rem(1))}
				size={UDim2.fromOffset(rem(5), rem(5))}
			/>

			<Text
				text={props.modification.name.upper()}
				size={UDim2.fromOffset(rem(20), rem(5))}
				backgroundTransparency={1}
				font={new Font("Highway Gothic", Enum.FontWeight.ExtraBold)}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={UDim2.fromOffset(rem(1), rem(1.25))}
				textXAlignment={"Left"}
				textSize={rem(2.5)}
			/>

			{isModificationEquipped && (
				<>
					<Text
						text={"EQUIPPED"}
						size={UDim2.fromOffset(rem(20), rem(5))}
						backgroundTransparency={1}
						font={new Font("Highway Gothic", Enum.FontWeight.SemiBold)}
						textColor={Color3.fromRGB(155, 155, 155)}
						position={UDim2.fromOffset(rem(1), rem(3.5))}
						textXAlignment={"Left"}
						textSize={rem(1.5)}
					/>

					<Frame
						size={UDim2.fromOffset(15, 15)}
						backgroundColor={Color3.fromRGB(155, 155, 155)}
						position={UDim2.fromOffset(rem(7), rem(5.5))}
					>
						<uicorner CornerRadius={new UDim(1, 0)} />
					</Frame>
				</>
			)}
		</Button>
	);
}
