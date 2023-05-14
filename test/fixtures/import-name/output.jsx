import { clsx as _clsx } from 'clsx';
<>
  <div className="c1 c2"></div>
  <div className={'c1 c2'}></div>
  <div className={_clsx(['c1', 'c2'])}></div>
  <div className={_clsx(['c1', ['c2']])}></div>
  <div
    className={_clsx({
      c1: true,
      c2: true,
    })}
  ></div>
  <div
    className={_clsx([
      'c1',
      {
        c2: true,
      },
    ])}
  ></div>
</>;
