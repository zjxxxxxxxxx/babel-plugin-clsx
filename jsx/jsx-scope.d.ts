declare module 'react' {
  namespace React {
    namespace JSX {
      type ElementType = globalThis.JSX.ElementType;
      interface Element extends globalThis.JSX.Element {}
      interface ElementClass extends globalThis.JSX.ElementClass {}
      interface ElementAttributesProperty extends globalThis.JSX.ElementAttributesProperty {}
      interface ElementChildrenAttribute extends globalThis.JSX.ElementChildrenAttribute {}
      type LibraryManagedAttributes<C, P> = globalThis.JSX.LibraryManagedAttributes<C, P>;
      interface IntrinsicAttributes extends globalThis.JSX.IntrinsicAttributes {}
      interface IntrinsicClassAttributes<T> extends globalThis.JSX.IntrinsicClassAttributes<T> {}
      interface IntrinsicElements extends globalThis.JSX.IntrinsicElements {}
    }
  }
}
