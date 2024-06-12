import { createProducer } from "@rbxts/reflex";
import { OSDocument, OSGuidelines } from "shared/constants/os";

export interface FileState {
	guidelines: OSDocument[];
	documents: OSDocument[];
}

const initialState: FileState = {
	guidelines: OSGuidelines,
	documents: [],
};

export const fileSlice = createProducer(initialState, {
	setGuidelines: (state, guidelines: OSDocument[]) => ({ ...state, guidelines }),
	setDocuments: (state, documents: OSDocument[]) => ({ ...state, documents }),
	addDocument: (state, document: OSDocument) => ({
		...state,
		documents: [
			...state.documents,
			{
				...document,
				created: DateTime.now().ToIsoDate(),
				updated: DateTime.now().ToIsoDate(),
			},
		],
	}),
	updateDocument: (state, document: OSDocument) => {
		const index = state.documents.findIndex((d) => d.filename === document.filename);
		const documents = [...state.documents];
		documents[index] = {
			...documents[index],
			...document,
			updated: DateTime.now().ToIsoDate(),
		};
		return { ...state, documents };
	},
	deleteDocument: (state, filename: string) => {
		const documents = state.documents.filter((d) => d.filename !== filename);
		return { ...state, documents };
	},
});
