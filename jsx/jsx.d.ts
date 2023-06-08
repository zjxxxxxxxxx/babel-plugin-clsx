declare type CustomClassName<P = {}> = {
  [K in keyof P]: K extends 'className' | `${infer _}ClassName`
    ? unknown
    : P[K];
};
declare type CustomClassNameElements<ES = {}> = {
  [E in keyof ES]: CustomClassName<ES[E]>;
};
declare namespace CustomJSX {
  interface Element extends JSX.Element {}
  interface ElementClass extends JSX.ElementClass {}
  interface ElementAttributesProperty extends JSX.ElementAttributesProperty {}
  interface ElementChildrenAttribute extends JSX.ElementChildrenAttribute {}
  type LibraryManagedAttributes<C, P> = CustomClassName<
    JSX.LibraryManagedAttributes<C, P>
  >;
  interface IntrinsicAttributes extends JSX.IntrinsicAttributes {}
  interface IntrinsicClassAttributes<T>
    extends JSX.IntrinsicClassAttributes<T> {}
  interface IntrinsicElements
    extends CustomClassNameElements<JSX.IntrinsicElements> {}
}
export type { CustomJSX as JSX };