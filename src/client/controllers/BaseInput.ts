// TODO: Use ContextActionUtility

export abstract class HandlesInput {
	abstract inputs: ReadonlyArray<Enum.KeyCode>;

	hasInput(input: Enum.KeyCode) {
		return this.inputs.includes(input);
	}
}

export type MultipleInput = ReadonlyArray<{ input: ReadonlyArray<Enum.KeyCode>; action: string }>;
export type BaseActions<T extends MultipleInput> = T extends ReadonlyArray<{
	input: ReadonlyArray<Enum.KeyCode>;
	action: infer A;
}>
	? A[]
	: never;

export abstract class HandlesMultipleInputs<T extends readonly string[]> {
	abstract inputs: ReadonlyArray<{ input: ReadonlyArray<Enum.KeyCode>; action: T[number] }>;

	hasInput(input: Enum.KeyCode) {
		const hasInput = this.inputs.find((inputAction) => inputAction.input.includes(input));
		if (!hasInput) return false;
		return hasInput.action;
	}
}
