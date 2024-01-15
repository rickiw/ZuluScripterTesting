// TODO: Use ContextActionUtility

export abstract class HandlesInput {
	abstract inputs: ReadonlyArray<Enum.KeyCode>;

	hasInput(input: Enum.KeyCode) {
		return this.inputs.includes(input);
	}
}
