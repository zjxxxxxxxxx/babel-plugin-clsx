import * as React from 'react/index';
import { JSX as ReactJSX } from 'react/index';

export = React;
export as namespace React;

declare type ClassName<Props = {}> = {
  [Key in keyof Props]: Key extends 'className' | `${string}ClassName` ? unknown : Props[Key];
};

declare type CustomElements<Elements = {}> = {
  [Tag in keyof Elements]: ClassName<Elements[Tag]>;
};

declare namespace React {
  namespace JSX {
    type ElementType = ReactJSX.ElementType;
    interface Element extends ReactJSX.Element {}
    interface ElementClass extends ReactJSX.ElementClass {}
    interface ElementAttributesProperty extends ReactJSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute extends ReactJSX.ElementChildrenAttribute {}
    type LibraryManagedAttributes<C, P> = ClassName<ReactJSX.LibraryManagedAttributes<C, P>>;
    interface IntrinsicAttributes extends ReactJSX.IntrinsicAttributes {}
    interface IntrinsicClassAttributes<T> extends ReactJSX.IntrinsicClassAttributes<T> {}
    interface IntrinsicElements extends CustomElements<ReactJSX.IntrinsicElements> {}
  }
}
