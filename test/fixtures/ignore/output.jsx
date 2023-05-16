import _clsx from 'clsx';
<div className="c1 c2" />;
<div className={'c1 c2'} />;
<div className={_clsx('c1', 'c2')} />;
<div className={['c1', ['c2']]} />;
<div
  className={{
    c1: true,
    c2: true,
  }}
/>;
<div
  className={[
    'c1',
    {
      c2: true,
    },
  ]}
/>;
