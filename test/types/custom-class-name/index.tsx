const Component = ({ customClassName }: { customClassName?: string }) => (
  <div className={customClassName} />
);
<Component customClassName="c1 c2" />;
<Component customClassName={'c1 c2'} />;
<Component customClassName={['c1', 'c2']} />;
<Component customClassName={['c1', ['c2']]} />;
<Component customClassName={['c1', { c2: true }]} />;
<Component customClassName={{ c1: true, c2: true }} />;
