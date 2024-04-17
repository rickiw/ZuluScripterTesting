import Log from "@rbxts/log";
import { lerpBinding } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Players, RunService } from "@rbxts/services";
import { Events, Functions } from "client/network";
import { clientStore } from "client/store";
import { selectActiveObjective, selectMenuObjective, selectPlayerSave } from "client/store/menu";
import { useMotion, useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { springs } from "shared/constants/springs";
import { Objective, selectObjective } from "shared/store/objectives";
import { priorityToImportance } from "shared/utils";
import { SideInformation } from "../side-information";

interface ObjectiveProps {
	objective: Objective & { active: boolean };
}

const player = Players.LocalPlayer;

function Objective({ objective }: ObjectiveProps) {
	const rem = useRem();

	const { name, description, priority } = objective;
	const playerSave = useSelector(selectPlayerSave);
	const [hover, hoverMotion] = useMotion(0);

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
				position={UDim2.fromOffset(rem(5), 0)}
				size={UDim2.fromScale(0.3, 0.5)}
				textSize={rem(2.5)}
				textXAlignment="Left"
			/>
			<Text
				text={description}
				font={fonts.gothic.regular}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={UDim2.fromOffset(rem(5), rem(2))}
				size={UDim2.fromScale(0.3, 0.5)}
				textSize={rem(1.5)}
				textXAlignment="Left"
			/>
			<Frame
				key="location-marker"
				backgroundTransparency={0.6}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				borderColor={Color3.fromRGB(255, 255, 255)}
				borderSize={1}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromOffset(rem(60), rem(5))}
				size={lerpBinding(hover, UDim2.fromOffset(40, 40), UDim2.fromOffset(45, 45))}
				event={{
					MouseEnter: () => hoverMotion.spring(1, springs.responsive),
					MouseLeave: () => hoverMotion.spring(0, springs.responsive),
				}}
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
							if (!RunService.IsRunning()) {
								clientStore.setSelectedObjective({ ...objective, active: math.random() > 0.5 });
								return;
							}
							if (!playerSave) {
								Log.Warn("Player save not found");
								return;
							}
							const objectiveData = playerSave.objectiveCompletion.find((o) => o.id === objective.id);
							clientStore.setSelectedObjective({ ...objective, ...objectiveData });
						},
					}}
				/>
			</Frame>
		</Frame>
	);
}

export function ObjectivesPage() {
	const rem = useRem();

	const objectives = useSelector(selectObjective("FP"));
	const selectedObjective = useSelector(selectMenuObjective);
	const activeObjective = useSelector(selectActiveObjective);

	return (
		<>
			<SideInformation />
			<scrollingframe
				key="objectives"
				Position={UDim2.fromOffset(rem(26), rem(7.5))}
				Size={UDim2.fromOffset(rem(65), rem(42.5))}
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
					CellSize={UDim2.fromOffset(rem(65), rem(10))}
				/>
				{objectives
					.sort((a, b) => a.id < b.id)
					.sort((a, b) => a.priority > b.priority)
					.map((objective) => (
						<Objective objective={{ ...objective, active: activeObjective?.id === objective.id }} />
					))}
			</scrollingframe>
			<Frame
				key="objective-info"
				backgroundTransparency={0.6}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				position={UDim2.fromOffset(rem(91), rem(7.5))}
				size={UDim2.fromOffset(rem(25), rem(42.5))}
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
					textSize={rem(2.5)}
					position={UDim2.fromScale(0.5, 0.05)}
					textYAlignment="Center"
					size={UDim2.fromScale(1, 0.15)}
				/>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					text="XX:XX:XX"
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textSize={rem(1.5)}
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
						textSize={rem(2)}
						size={UDim2.fromScale(0.95, 0.95)}
						position={UDim2.fromScale(0.5, 0.5)}
						textYAlignment="Top"
						textXAlignment="Left"
					/>
					{selectedObjective !== undefined && (
						<>
							<Frame
								key="purchase"
								backgroundTransparency={0.6}
								backgroundColor={Color3.fromRGB(0, 0, 0)}
								borderColor={Color3.fromRGB(255, 255, 255)}
								borderSize={selectedObjective.completion?.completed === true ? 0 : 1}
								anchorPoint={new Vector2(0.5, 0.5)}
								position={UDim2.fromScale(0.5, 0.9)}
								size={UDim2.fromScale(0.3, 0.075)}
							>
								<textbutton
									BackgroundTransparency={1}
									Size={UDim2.fromScale(1, 1)}
									Text={
										selectedObjective.completion?.completed === true
											? "COMPLETED"
											: selectedObjective.active
												? "STARTED"
												: "START"
									}
									TextColor3={Color3.fromRGB(255, 255, 255)}
									FontFace={fonts.gothic.bold}
									TextSize={rem(1.5)}
									TextWrapped={true}
									Event={{
										MouseButton1Down: () => {
											if (selectedObjective.completion?.completed === true) {
												return;
											}
											const startedObjective = Functions.BeginObjective(
												selectedObjective.id,
											).expect();
											if (startedObjective === false) {
												Log.Warn("Failed to start objective");
												return;
											}

											clientStore.setSelectedObjective({ ...startedObjective, active: true });
										},
									}}
								/>
							</Frame>
							{selectedObjective.active && (
								<textbutton
									BackgroundTransparency={1}
									AnchorPoint={new Vector2(0.5, 0.5)}
									Text={"STOP OBJECTIVE"}
									TextColor3={Color3.fromRGB(255, 0, 0)}
									FontFace={fonts.gothic.regular}
									TextSize={rem(1)}
									TextTransparency={0.2}
									Position={UDim2.fromScale(0.5, 0.97)}
									TextYAlignment="Center"
									Size={UDim2.fromScale(1, 0.1)}
									Event={{
										MouseButton1Click: () => {
											Events.StopObjective(selectedObjective.id);
											clientStore.setSelectedObjective({
												...selectedObjective,
												active: false,
											});
										},
									}}
								/>
							)}
						</>
					)}
				</Frame>
			</Frame>
		</>
	);
}
