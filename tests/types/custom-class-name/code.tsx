import React from 'react';
const CustomComponent: React.FC<{ customClassName?: string }> = ({ customClassName }) => (
  <div className={customClassName} />
);
<CustomComponent customClassName="c1 c2" />;
<CustomComponent customClassName={'c1 c2'} />;
<CustomComponent customClassName={['c1', 'c2']} />;
<CustomComponent customClassName={{ c1: true, c2: true }} />;
