import { BaseComponent, Component } from "@flamework/components";
import { OnRender, OnStart } from "@flamework/core";
import { New, NewProperties } from "@rbxts/fusion";
import { fonts } from "shared/constants/fonts";

export interface ScrollableTextInstance extends Frame {}

export interface ScrollableTextAttributes {
	text: string;
	textSize: number;
	speed: number;
	amount: number;
}

@Component({
	tag: "scrollableText",
	defaults: {
		speed: 1,
		textSize: -1,
	},
})
export class ScrollableText<A extends ScrollableTextAttributes, I extends ScrollableTextInstance>
	extends BaseComponent<A, I>
	implements OnStart, OnRender
{
	textLabels: TextLabel[] = [];

	onStart() {
		const properties: NewProperties<TextLabel> = {
			Parent: this.instance,
			BackgroundTransparency: 1,
			Text: this.attributes.text,
			...(this.attributes.textSize === -1
				? { TextScaled: true }
				: { TextScaled: false, TextSize: this.attributes.textSize }),
			TextXAlignment: Enum.TextXAlignment.Center,
			TextWrapped: false,
			FontFace: fonts.gothic.bold,
			Size: UDim2.fromScale(1 / this.attributes.amount, 1),
		};
		for (let i = 0; i < this.attributes.amount; i++) {
			this.textLabels.push(
				New("TextLabel")({
					...properties,
					Position: UDim2.fromScale((1 / this.attributes.amount) * i + 0.1 * i, 0),
				}),
			);
		}
	}

	onRender(dt: number) {
		// create a scrolling algorithm that uses the textLabels array to index which text label is being scrolled
		// they can go off screen and then reset to the right side of the screen
		this.textLabels.forEach((textLabel) => {
			textLabel.Position = textLabel.Position.sub(UDim2.fromOffset(this.attributes.speed, 0));
			if (textLabel.AbsolutePosition.X < -textLabel.AbsoluteSize.X) {
				textLabel.Position = UDim2.fromScale(1, 0);
			}
		});
	}
}
