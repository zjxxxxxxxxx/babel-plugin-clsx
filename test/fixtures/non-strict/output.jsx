import _clsx from 'clsx';
<Component customClassName="c1 c2" />;
<Component customClassName={'c1 c2'} />;
<Component customClassName={_clsx('c1', 'c2')} />;
<Component customClassName={_clsx('c1', ['c2'])} />;
<Component
  customClassName={_clsx('c1', {
    c2: true,
  })}
/>;
<Component
  customClassName={_clsx({
    c1: true,
    c2: true,
  })}
/>;
