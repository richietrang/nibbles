import React from 'react';
import './DefaultLayout.css';

const DefaultLayout = ({ children }) => {
  return (
    <div className="outerContent">
      <div className="innerContent">
        {children}
      </div>
    </div>
  );
}

export default DefaultLayout;
