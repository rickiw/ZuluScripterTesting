export const teams = {
	"Foundation Personnel": [new BrickColor("Black").Color, 5182937],
	"Internal Security Department": [new BrickColor("White").Color, 32858227],
	"Mobile Task Forces": [new BrickColor("Mid gray").Color, 5186594],
	"Security Department": [new BrickColor("Black metallic").Color, 5182941],
	"Administrative Department": [new BrickColor("Lily white").Color, 5186557],
	"Department of External Affairs": [new BrickColor("Phosph. White").Color, 5188274],
	"Engineering & Technical Services": [new BrickColor("Grey").Color, 5186563],
	"Ethics Committee": [new BrickColor("Institutional white").Color, 5186568],
	"Logistics Department": [new BrickColor("Light blue").Color, 5186570],
	"Manufacturing Department": [new BrickColor("Light grey").Color, 5186577],
	"Medical Department": [new BrickColor("Light red").Color, 5186582],
	"Scientific Department": [new BrickColor("Light bluish green").Color, 5186596],
	"Chaos Insurgency": [new BrickColor("Really red").Color, 32678341],
	"Escaped Class-D": [new BrickColor("Fog").Color],
	"Class-D": [new BrickColor("Bright orange").Color],
} satisfies { [key: string]: [Color3, number?] };

export type TeamName = keyof typeof teams;
