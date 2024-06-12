import { SharedState } from "../..";

export const selectDocuments = (state: SharedState) => state.os.file.documents;
export const selectGuidelines = (state: SharedState) => state.os.file.guidelines;
export const selectDocument = (documentName?: string) => (state: SharedState) =>
	state.os.file.documents.find(({ filename }) => filename === documentName) ??
	state.os.file.guidelines.find(({ filename }) => filename === documentName);
export const selectIsAuthor = (documentName: string | undefined, playerName: string) => (state: SharedState) =>
	state.os.file.documents.some(({ filename, author }) => filename === documentName && author === playerName);
