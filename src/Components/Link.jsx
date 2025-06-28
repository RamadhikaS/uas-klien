import React from 'react';

const Link = ({ href, children, className = '' }) => {
  return (
    <a href={href} className={`text-blue-600 hover:text-blue-800 hover:underline ${className}`}>
      {children}
    </a>
  );
};

export default Link;