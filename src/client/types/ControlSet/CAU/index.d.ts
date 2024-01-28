interface ContextActionUtility {
	BindAction(
		actionName: string,
		functionToBind: (...a: any[]) => void,
		createTouchButton: boolean,
		...a: any[]
	): void;

	BindActionAtPriority(
		actionName: string,
		functionToBind: (...a: any[]) => void,
		createTouchButton: boolean,
		priorityLevel: number,
		...a: any[]
	): void;

	UnbindAction(actionName: string): void;
	DisableAction(actionName: string): void;

	SetTitle(actionName: string, title: string): void;
	SetImage(actionName: string, image: string): void;

	GetButton(actionName: string): ImageButton;
}

declare const CAU: ContextActionUtility;
export = CAU;
