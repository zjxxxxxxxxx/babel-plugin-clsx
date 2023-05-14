<div className="c1 c2" />;
<div className={'c1 c2'} />;
<div className={['c1', 'c2']} />;
<div
  // @clsx-ignore
  className={['c1', ['c2']]}
/>;
<div
  // @clsx-ignore
  className={{
    c1: true,
    c2: true,
  }}
/>;
<div
  // @clsx-ignore
  className={[
    'c1',
    {
      c2: true,
    },
  ]}
/>;
