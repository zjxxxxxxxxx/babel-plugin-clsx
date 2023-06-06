import * as React from 'react';

type CustomClassName<P = {}> = {
  [K in keyof P]: K extends 'className' | `${infer _}ClassName`
    ? unknown
    : P[K];
};

type CustomClassNameElements<P = {}> = {
  [K in keyof P]: CustomClassName<P[K]>;
};

export namespace JSX {
  interface Element extends React.JSX.Element {}
  interface ElementClass extends React.JSX.ElementClass {}
  interface ElementAttributesProperty
    extends React.JSX.ElementAttributesProperty {}
  interface ElementChildrenAttribute
    extends React.JSX.ElementChildrenAttribute {}
  type LibraryManagedAttributes<C, P> = CustomClassName<
    React.JSX.LibraryManagedAttributes<C, P>
  >;
  interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
  interface IntrinsicClassAttributes<T>
    extends React.JSX.IntrinsicClassAttributes<T> {}
  interface IntrinsicElements
    extends CustomClassNameElements<React.JSX.IntrinsicElements> {}
}
