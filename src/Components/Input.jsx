import React from 'react';

const Input = ({ type = 'text', name, value, onChange, placeholder, className = '', ...rest }) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
      {...rest}
    />
  );
};

export default Input;