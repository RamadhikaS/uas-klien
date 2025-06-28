import React from 'react';

const Checkbox = ({ id, name, value, checked, onChange, label, disabled, className = '' }) => (
  <label htmlFor={id} className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'opacity-50' : ''} ${className}`}>
    <input
      type="checkbox"
      id={id}
      name={name}
      value={value} 
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
    />
    <span>{label}</span>
  </label>
);

export default Checkbox;