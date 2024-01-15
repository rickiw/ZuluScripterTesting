export abstract class HandlesInput {
	abstract inputs: ReadonlySet<Enum.KeyCode>;

	hasInput(input: Enum.KeyCode) {
		return this.inputs.has(input);
	}
}
