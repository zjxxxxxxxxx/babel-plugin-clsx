import clsx_ from 'classnames';
<>
  <div className="c1 c2"></div>
  <div className={'c1 c2'}></div>
  <div className={clsx_(['c1', 'c2'])}></div>
  <div className={clsx_(['c1', ['c2']])}></div>
  <div
    className={clsx_({
      c1: true,
      c2: true,
    })}
  ></div>
  <div
    className={clsx_([
      'c1',
      {
        c2: true,
      },
    ])}
  ></div>
</>;
