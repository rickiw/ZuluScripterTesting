import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectMenuObjective } from "client/store/menu";
import { fonts } from "shared/constants/fonts";
import { Objective, selectObjective } from "shared/store/objectives";
import { priorityToImportance } from "shared/utils";
import { Frame } from "../../frame";
import { Text } from "../../text";
import { SideInformation } from "../side-information";

interface ObjectiveProps {
	objective: Objective;
}

function Objective({ objective }: ObjectiveProps) {
	const { name, description, priority } = objective;

	return (
		<Frame key={name} backgroundColor={Color3.fromRGB(227, 227, 227)}>
			<uigradient
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, Color3.fromRGB(143, 143, 143)),
						new ColorSequenceKeypoint(1, Color3.fromRGB(0, 0, 0)),
					])
				}
				Transparency={
					new NumberSequence([new NumberSequenceKeypoint(0, 0.5), new NumberSequenceKeypoint(1, 0.5)])
				}
			/>
			<Frame
				key="status-marker"
				position={UDim2.fromScale(0.016, 0)}
				size={UDim2.fromScale(0.025, 1)}
				backgroundColor={
					priority === 1
						? Color3.fromRGB(143, 143, 143)
						: priority === 2
						? Color3.fromRGB(171, 179, 0)
						: Color3.fromRGB(245, 0, 0)
				}
			/>
			<Text
				text={name}
				font={fonts.gothic.bold}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={UDim2.fromScale(0.081, 0)}
				size={UDim2.fromScale(0.3, 0.5)}
				textSize={16}
				textXAlignment="Left"
			/>
			<Text
				text={description}
				font={fonts.gothic.regular}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={UDim2.fromScale(0.081, 0.225)}
				size={UDim2.fromScale(0.3, 0.5)}
				textSize={14}
				textXAlignment="Left"
			/>
			<Frame
				key="location-marker"
				backgroundTransparency={0.6}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				borderColor={Color3.fromRGB(255, 255, 255)}
				borderSize={1}
				position={UDim2.fromScale(0.885, 0.28)}
				size={UDim2.fromOffset(25, 25)}
			>
				<textbutton
					BackgroundTransparency={1}
					Size={UDim2.fromScale(1, 1)}
					Text="!"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					FontFace={fonts.gothic.bold}
					TextScaled={true}
					Event={{
						MouseButton1Down: () => {
							clientStore.setSelectedObjective(objective);
						},
					}}
				/>
			</Frame>
		</Frame>
	);
}

export function ObjectivesPage() {
	const objectives = useSelector(selectObjective("FP"));
	const selectedObjective = useSelector(selectMenuObjective);

	return (
		<>
			<SideInformation />
			<scrollingframe
				key="objectives"
				Position={UDim2.fromScale(0.22, 0.14)}
				Size={UDim2.fromScale(0.5, 0.825)}
				BackgroundTransparency={0.5}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={1}
				BorderColor3={Color3.fromRGB(255, 255, 255)}
				ScrollBarThickness={7}
				VerticalScrollBarPosition={Enum.VerticalScrollBarPosition.Left}
			>
				<uigridlayout
					FillDirectionMaxCells={0}
					FillDirection={Enum.FillDirection.Horizontal}
					SortOrder={Enum.SortOrder.LayoutOrder}
					CellSize={UDim2.fromScale(1, 0.08)}
				/>
				{objectives
					.sort((a, b) => a.id < b.id)
					.sort((a, b) => a.priority > b.priority)
					.map((objective) => (
						<Objective objective={objective} />
					))}
			</scrollingframe>
			<Frame
				key="objective-info"
				backgroundTransparency={0.6}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				position={UDim2.fromScale(0.72, 0.14)}
				size={UDim2.fromScale(0.25, 0.825)}
			>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					text=""
					position={UDim2.fromScale(0.5, 0.075)}
					borderSize={1}
					borderColor={Color3.fromRGB(255, 255, 255)}
					backgroundTransparency={0.7}
					backgroundColor={Color3.fromRGB(0, 0, 0)}
					size={UDim2.fromScale(1, 0.15)}
				/>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					text="OBJECTIVE REFRESH"
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textSize={16}
					position={UDim2.fromScale(0.5, 0.05)}
					textYAlignment="Center"
					size={UDim2.fromScale(1, 0.15)}
				/>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					text="XX:XX:XX"
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textSize={16}
					textYAlignment="Bottom"
					position={UDim2.fromScale(0.5, 0.125)}
				/>
				<Frame
					key="objective-description"
					backgroundTransparency={0.7}
					backgroundColor={Color3.fromRGB(0, 0, 0)}
					borderColor={Color3.fromRGB(255, 255, 255)}
					borderSize={1}
					position={UDim2.fromScale(0, 0.15)}
					size={UDim2.fromScale(1, 0.85)}
				>
					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						text={
							selectedObjective
								? `${selectedObjective.name} (${priorityToImportance(selectedObjective.priority)}): ${
										selectedObjective.description
								  }`
								: "Objective Description...."
						}
						textWrapped={true}
						textTruncate="AtEnd"
						textColor={Color3.fromRGB(255, 255, 255)}
						font={fonts.gothic.regular}
						textSize={16}
						size={UDim2.fromScale(0.95, 0.95)}
						position={UDim2.fromScale(0.5, 0.5)}
						textYAlignment="Top"
						textXAlignment="Left"
					/>
				</Frame>
			</Frame>
		</>
	);
}
