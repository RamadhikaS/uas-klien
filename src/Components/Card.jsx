import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow-xl rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;