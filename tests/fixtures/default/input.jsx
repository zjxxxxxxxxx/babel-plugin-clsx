import classNames from 'classnames';
<div className />;
<div className="c1 c2" />;
<div className={'c1 c2'} />;
<div className={classNames('c1', 'c2')} />;
<div className={['c1', 'c2']} />;
<div className={{ c1: true, c2: true }} />;
