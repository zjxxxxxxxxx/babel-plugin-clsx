import classNames from 'classnames';
import _clsx from 'clsx';
<div className />;
<div className="c1 c2" />;
<div className={'c1 c2'} />;
<div className={classNames('c1', 'c2')} />;
<div className={_clsx('c1', 'c2')} />;
<div
  className={_clsx({
    c1: true,
    c2: true,
  })}
/>;
