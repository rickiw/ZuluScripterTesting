import { useMountEffect } from "@rbxts/pretty-react-hooks";
import Roact, { useRef } from "@rbxts/roact";

interface Props extends Roact.PropsWithChildren {
	readonly ExtraCameraDepth?: number;
	readonly Native: JSX.IntrinsicElement<ViewportFrame>;
	readonly Object: BasePart | Model;
}

function setDefaultCameraView(camera: Camera, model: Model, cameraDepth = 0): void {
	const [modelCF] = model.GetBoundingBox();

	camera.CFrame = CFrame.lookAt(new Vector3(0, 4, 7.5), modelCF.Position);
}

/**
 * Renders a viewport for displaying an object.
 *
 * @param props - The component props.
 * @param props.ExtraCameraDepth - Additional depth to push the camera back.
 * @param props.Native - The native props to a viewport.
 * @param props.Object - The object to be displayed in the viewport.
 * @param props.children - The child elements.
 * @returns The rendered viewport.
 * @component
 * @example
 *
 * ```tsx
 * <ObjectViewport
 * 	Native={{ Size: new UDim2(1, 0, 1, 0) }}
 * 	Object={new Part()}
 * />;
 * ```
 *
 */
export default function ObjectViewport({ ExtraCameraDepth, Native, Object, children }: Props) {
	// Setup the viewport after mounting when we have a ref to it
	const viewportRef = useRef<ViewportFrame>();

	useMountEffect(() => {
		const viewport = viewportRef.current;
		assert(viewport !== undefined, "Viewport is not defined");

		Object.Parent = viewport;

		const viewportCamera = new Instance("Camera");
		viewport.CurrentCamera = viewportCamera;
		setDefaultCameraView(viewportCamera, Object as Model, ExtraCameraDepth);
		viewportCamera.Parent = viewport;
	});

	return (
		<viewportframe {...Native} ref={viewportRef}>
			{children}
		</viewportframe>
	);
}
