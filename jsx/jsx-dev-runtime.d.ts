import * as React from 'react/index';

declare type ClassName<Props = {}> = {
  [Key in keyof Props]: Key extends 'className' | `${string}ClassName` ? unknown : Props[Key];
};

declare type CustomElements<Elements = {}> = {
  [Tag in keyof Elements]: ClassName<Elements[Tag]>;
};

export declare namespace JSX {
  type ElementType = React.JSX.ElementType;
  interface Element extends React.JSX.Element {}
  interface ElementClass extends React.JSX.ElementClass {}
  interface ElementAttributesProperty extends React.JSX.ElementAttributesProperty {}
  interface ElementChildrenAttribute extends React.JSX.ElementChildrenAttribute {}
  type LibraryManagedAttributes<C, P> = ClassName<React.JSX.LibraryManagedAttributes<C, P>>;
  interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
  interface IntrinsicClassAttributes<T> extends React.JSX.IntrinsicClassAttributes<T> {}
  interface IntrinsicElements extends CustomElements<React.JSX.IntrinsicElements> {}
}
