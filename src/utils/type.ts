export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Nullable<T> = { [P in keyof T]: T[P] | null };

export type Flatten<T> = T extends Array<infer U> ? U : T;
