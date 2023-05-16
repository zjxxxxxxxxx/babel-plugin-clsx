import _clsx from 'clsx';
const classNames1 = ['c1', 'c2'];
const classNames2 = ['c1', ['c2']];
const classNames3 = {
  c1: true,
  c2: true,
};
const classNames4 = [
  'c1',
  {
    c2: true,
  },
];
<div className="c1 c2" />;
<div className={'c1 c2'} />;
<div className={_clsx(classNames1)} />;
<div className={_clsx(classNames2)} />;
<div className={_clsx(classNames3)} />;
<div className={_clsx(classNames4)} />;
