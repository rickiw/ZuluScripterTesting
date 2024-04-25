import Object from "@rbxts/object-utils";

/**
 * Catppuccin Mocha Accents
 * @see https://github.com/catppuccin/catppuccin
 */
export const accents = {
	rosewater: Color3.fromRGB(245, 224, 220),
	flamingo: Color3.fromRGB(242, 205, 205),
	pink: Color3.fromRGB(245, 194, 231),
	mauve: Color3.fromRGB(203, 166, 247),
	red: Color3.fromRGB(243, 139, 168),
	maroon: Color3.fromRGB(235, 160, 172),
	peach: Color3.fromRGB(250, 179, 135),
	yellow: Color3.fromRGB(249, 226, 175),
	green: Color3.fromRGB(166, 227, 161),
	teal: Color3.fromRGB(148, 226, 213),
	sky: Color3.fromRGB(137, 220, 235),
	sapphire: Color3.fromRGB(116, 199, 236),
	blue: Color3.fromRGB(137, 180, 250),
	lavender: Color3.fromRGB(180, 190, 254),
} as const;

/**
 * These have been replaced with the palette from mockups
 */
export const neutrals = {
	text: Color3.fromRGB(242, 242, 242),
	subtext1: Color3.fromRGB(179, 179, 179),
	subtext0: Color3.fromRGB(75, 80, 83),
	overlay2: Color3.fromRGB(143, 149, 111),
	overlay1: Color3.fromRGB(106, 109, 81),
	overlay0: Color3.fromRGB(39, 43, 29),
	surface2: Color3.fromRGB(153, 153, 153),
	surface1: Color3.fromRGB(33, 38, 41),
	surface0: Color3.fromRGB(25, 29, 32),
	active1: Color3.fromRGB(61, 65, 42),
	base: Color3.fromRGB(16, 20, 21),
	mantle: Color3.fromRGB(24, 24, 37),
	crust: Color3.fromRGB(17, 17, 27),
} as const;

const base = {
	white: Color3.fromRGB(255, 255, 255),
	offwhite: Color3.fromRGB(234, 238, 253),
	black: Color3.fromRGB(0, 0, 0),
};

/**
 * Catppuccin Mocha Palette
 * @see https://github.com/catppuccin/catppuccin
 */
export const palette = {
	...accents,
	...neutrals,
	...base,
} as const;

/**
 * An ordered list of all the accent colors
 */
export const accentList = [
	"rosewater",
	"flamingo",
	"pink",
	"mauve",
	"red",
	"maroon",
	"peach",
	"yellow",
	"green",
	"teal",
	"sky",
	"sapphire",
	"blue",
	"lavender",
] as const;

export function getRandomAccent(): Color3 {
	const values = Object.values(accents);
	return values[math.random(0, values.size() - 1)];
}
