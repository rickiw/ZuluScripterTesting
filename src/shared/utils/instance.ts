export function changeClass<T extends keyof CreatableInstances>(
	instance: Instance,
	className: T,
): CreatableInstances[T] {
	const newInstance = new Instance(className, instance.Parent);
	newInstance.Name = instance.Name;
	instance.GetChildren().forEach((child) => {
		child.Parent = newInstance;
	});
	instance.Destroy();
	return newInstance;
}

export function getModelCornerDistance(model: Model) {
	const [_, size] = model.GetBoundingBox();
	return new Vector3(size.X / 2 + size.Y / 2 + size.Z / 2).Magnitude;
}
