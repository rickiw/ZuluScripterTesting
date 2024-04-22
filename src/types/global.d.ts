interface _G {
	/** Enable React dev mode. */
	__DEV__: boolean;

	/** Enable React profiling mode. */
	__PROFILE__: boolean;
}

/* Type Helper */
interface Instance {
	WaitForChild<I extends Instance>(this: Instance, childName: string | number): I;
	WaitForChild<I extends Instance>(this: Instance, childName: string | number, timeOut: number): I | undefined;
	FindFirstChild<I extends Instance>(this: Instance, childName: string | number, recursive?: boolean): I | undefined;
}
