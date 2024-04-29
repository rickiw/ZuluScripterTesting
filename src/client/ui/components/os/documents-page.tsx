import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectActiveSection, selectCurrentDocument, selectCurrentUser } from "client/store/terminal";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Group } from "client/ui/library/group";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { selectDocument, selectDocuments, selectGuidelines, selectIsAuthor } from "shared/store/os";
import { SCPCommandScreen, SCPScrollingFrame, SCPTable, SCPTextTableItem } from "../scp";

const ActiveDocument = () => {
	const rem = useRem();
	const playerName = useSelector(selectCurrentUser);
	const currentDocument = useSelector(selectCurrentDocument);
	const activeDocument = useSelector(selectDocument(currentDocument));
	const isAuthor = useSelector(selectIsAuthor(currentDocument, playerName));
	if (activeDocument === undefined) {
		return <SCPCommandScreen text={"ACCESS FILE SYSTEM"} />;
	}
	return (
		<>
			<Group
				size={new UDim2(1, -rem(2), 1, -rem(2))}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={new UDim2(0.5, 0, 0.5, 0)}
			>
				<uilistlayout FillDirection={Enum.FillDirection.Vertical} Padding={new UDim(0, rem(1))} />
				<Text
					layoutOrder={1}
					text={activeDocument.filename.upper()}
					size={new UDim2(1, 0, 0, rem(1.5))}
					textColor={palette.subtext1}
					textSize={rem(1.5)}
					backgroundTransparency={1}
					textWrapped={true}
					textXAlignment="Left"
					textYAlignment="Center"
					font={fonts.inter.extra}
				/>
				<SCPScrollingFrame size={new UDim2(1, 0, 1, -rem(4))} backgroundTransparency={1}>
					<Text
						textAutoResize="Y"
						textXAlignment="Left"
						textYAlignment="Top"
						layoutOrder={2}
						textSize={rem(1.5)}
						textWrapped={true}
						richText={true}
						text={activeDocument.contents}
						font={fonts.robotoMono.regular}
						size={new UDim2(1, 0, 0, rem(10))}
						textColor={palette.white}
					/>
				</SCPScrollingFrame>
			</Group>
			<Frame
				size={new UDim2(1, 0, 0, rem(2))}
				backgroundColor={palette.surface1}
				backgroundTransparency={0}
				anchorPoint={new Vector2(0, 1)}
				position={new UDim2(0, 0, 1, 0)}
			>
				<uilistlayout FillDirection={Enum.FillDirection.Horizontal} Padding={new UDim(0, rem(0.5))} />
				{isAuthor ? <></> : <></>}
			</Frame>
		</>
	);
};

const Guidelines = () => {
	const rem = useRem();
	const guidelines = useSelector(selectGuidelines);
	return (
		<SCPTable layoutOrder={2} size={new UDim2(1, 0, 0, rem(2))} header="TESTING GUIDELINES">
			{guidelines.map(({ filename, author }) => (
				<SCPTextTableItem
					text={filename.upper()}
					subText={author}
					onClick={() => {
						clientStore.setCurrentDocument(filename);
					}}
				/>
			))}
		</SCPTable>
	);
};

const Documents = () => {
	const rem = useRem();
	const documents = useSelector(selectDocuments);
	return (
		<SCPTable layoutOrder={2} size={new UDim2(1, 0, 0, rem(2))} header="TESTING DOCUMENTS">
			{documents.map(({ filename, author }) => (
				<SCPTextTableItem
					text={filename.upper()}
					subText={author}
					onClick={() => {
						clientStore.setCurrentDocument(filename);
					}}
				/>
			))}
		</SCPTable>
	);
};

export const DocumentsPage = ({
	backgroundTransparency,
}: {
	backgroundTransparency?: Roact.Binding<number> | number;
}) => {
	const rem = useRem();
	const activeSection = useSelector(selectActiveSection);

	if (activeSection !== "document") {
		return <></>;
	}

	return (
		<>
			<Group size={UDim2.fromOffset(rem(36), rem(30))} position={UDim2.fromOffset(rem(1), rem(11))}>
				<Text
					layoutOrder={1}
					text={"LOGGED DOCUMENTS"}
					size={UDim2.fromOffset(rem(30), rem(1.5))}
					position={UDim2.fromOffset(rem(2), rem(2))}
					textColor={palette.subtext1}
					textSize={rem(1.5)}
					textTransparency={backgroundTransparency}
					backgroundTransparency={1}
					textWrapped={true}
					textXAlignment="Left"
					textYAlignment="Center"
					font={fonts.inter.extra}
				/>
				<SCPScrollingFrame
					size={new UDim2(1, -rem(2), 1, -rem(5))}
					position={new UDim2(0, rem(2), 0, rem(5))}
					backgroundTransparency={1}
				>
					<uilistlayout FillDirection={Enum.FillDirection.Vertical} Padding={new UDim(0, rem(2))} />
					<Guidelines />
					<Documents />
				</SCPScrollingFrame>
			</Group>
			<Group
				size={UDim2.fromOffset(rem(34), rem(36))}
				position={new UDim2(1, -rem(3), 0, rem(3))}
				anchorPoint={new Vector2(1, 0)}
			>
				<uistroke Color={palette.white} Transparency={backgroundTransparency} />
				<ActiveDocument />
			</Group>
		</>
	);
};
