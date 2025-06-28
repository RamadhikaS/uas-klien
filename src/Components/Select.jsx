import React from 'react';

const Select = ({
  id,
  name,
  value,
  onChange,
  options = [],
  className = '',
  disabled,
  defaultOptionText = "-- Pilih Opsi --"
}) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
    >
      {defaultOptionText && <option value="" disabled={!!value && value !== ""}>{defaultOptionText}</option>}

      {Array.isArray(options) && options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

export default Select;