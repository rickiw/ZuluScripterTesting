export type Indexable<K extends string | number | symbol, V> = { [P in K]: V };
