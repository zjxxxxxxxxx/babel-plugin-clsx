// @clsx-ignore-global
// This comment should remain
<div className="c1 c2" />;
<div className={'c1 c2'} />;
<div
  // @clsx-ignore
  className={['c1', 'c2']}
/>;
<div
  // This comment should remain
  className={['c1', ['c2']]}
/>;
<div className={{ c1: true, c2: true }} />;
<div className={['c1', { c2: true }]} />;
