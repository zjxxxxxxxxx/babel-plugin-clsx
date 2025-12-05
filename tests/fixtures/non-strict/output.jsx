import _clsx from 'clsx';
import classNames from 'classnames';
<Component customClassName />;
<Component customClassName="c1 c2" />;
<Component customClassName={'c1 c2'} />;
<Component customClassName={classNames('c1', 'c2')} />;
<Component customClassName={_clsx('c1', 'c2')} />;
<Component
  customClassName={_clsx({
    c1: true,
    c2: true,
  })}
/>;
