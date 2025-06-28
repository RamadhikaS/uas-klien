import React from 'react';

const Heading = ({ as: Component = 'h1', children, className = '' }) => {
  let sizeClass = '';
  switch (Component) {
    case 'h1':
      sizeClass = 'text-3xl font-bold text-gray-800 mb-6';
      break;
    case 'h2':
      sizeClass = 'text-2xl font-semibold text-gray-700 mb-4';
      break;
    case 'h3':
      sizeClass = 'text-xl font-semibold text-gray-700 mb-3';
      break;
    default:
      sizeClass = 'text-lg font-medium text-gray-700 mb-2';
  }
  return <Component className={`${sizeClass} ${className}`}>{children}</Component>;
};

export default Heading;