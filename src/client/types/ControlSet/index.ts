import CAU from "./CAU";

export interface Bind {
	ID: string;
	Name: string;

	Enabled?: boolean;
	Mobile: boolean;

	onBegin?: () => void;
	onEnd?: () => void;
	once?: (state: Enum.UserInputState) => void;

	controls: (Enum.KeyCode | Enum.UserInputType)[];
}

export class ControlSet {
	private binds: Bind[];
	constructor() {
		this.binds = [];
	}

	add(data: Bind) {
		this.binds.push(data);

		CAU.BindAction(
			data.ID,
			(_, state: Enum.UserInputState) => {
				if (state === Enum.UserInputState.Begin && data.onBegin) {
					data.onBegin();
				}

				if (state === Enum.UserInputState.End && data.onEnd) {
					data.onEnd();
				}

				if (data.once) data.once(state);
			},
			data.Mobile,
			...data.controls,
		);

		CAU.SetTitle(data.ID, data.Name);
	}

	remove(id: string) {
		const [s, r] = pcall(() => CAU.UnbindAction(id));
	}
}
