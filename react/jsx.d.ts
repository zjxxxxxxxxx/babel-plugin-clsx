type CustomClassName<P = {}> = {
  [K in keyof P]: K extends 'className' | `${infer _}ClassName`
    ? unknown
    : P[K];
};
type CustomClassNameElements<P = {}> = {
  [K in keyof P]: CustomClassName<P[K]>;
};

export namespace CustomJSX {
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
