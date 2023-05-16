import _clsx from 'clsx';
import classNames from 'classnames';
const className1 = ['c1', 'c2'];
const className2 = ['c1', ['c2']];
const className3 = {
  c1: true,
  c2: true,
};
const className4 = [
  'c1',
  {
    c2: true,
  },
];
<div className="c1 c2" />;
<div className={'c1 c2'} />;
<div className={classNames('c1', 'c2')} />;
<div className={_clsx(className1)} />;
<div className={_clsx(className2)} />;
<div className={_clsx(className3)} />;
<div className={_clsx(className4)} />;
