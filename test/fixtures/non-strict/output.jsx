import _clsx from 'clsx';
<>
  <div elClassName="c1 c2"></div>
  <div elClassName={'c1 c2'}></div>
  <div elClassName={_clsx(['c1', 'c2'])}></div>
  <div elClassName={_clsx(['c1', ['c2']])}></div>
  <div
    elClassName={_clsx({
      c1: true,
      c2: true,
    })}
  ></div>
  <div
    elClassName={_clsx([
      'c1',
      {
        c2: true,
      },
    ])}
  ></div>
</>;
