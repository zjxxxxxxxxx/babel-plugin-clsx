import _clsx from 'clsx';
<Component compClassName="c1 c2" />;
<Component compClassName={'c1 c2'} />;
<Component compClassName={_clsx('c1', 'c2')} />;
<Component compClassName={_clsx('c1', ['c2'])} />;
<Component
  compClassName={_clsx({
    c1: true,
    c2: true,
  })}
/>;
<Component
  compClassName={_clsx('c1', {
    c2: true,
  })}
/>;
