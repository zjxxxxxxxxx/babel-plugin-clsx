<>
  <div className="c1 c2"></div>
  <div className={'c1 c2'}></div>
  <div className={['c1', 'c2']}></div>
  <div
    // @clsx-ignore
    className={['c1', ['c2']]}
  ></div>
  <div
    // @clsx-ignore
    className={{
      c1: true,
      c2: true,
    }}
  ></div>
  <div
    // @clsx-ignore
    className={[
      'c1',
      {
        c2: true,
      },
    ]}
  ></div>
</>;
