import React from 'react';

const Button = ({ children, onClick, type = "button", variant = "primary", size = "md", className = '', as: Component, ...rest }) => {
  let baseStyle = "font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition ease-in-out duration-150";
  let variantStyle = "";
  let sizeStyle = "";

  switch (variant) {
    case "danger":
      variantStyle = "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500";
      break;
    case "warning":
      variantStyle = "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400";
      break;
    case "secondary":
      variantStyle = "bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-400";
      break;
    default:
      variantStyle = "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500";
  }

  switch (size) {
    case "sm":
      sizeStyle = "px-3 py-1 text-sm";
      break;
    default:
      sizeStyle = "px-4 py-2 text-base";
  }

  if (Component) {
    return (
      <Component
        className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
        {...rest}
      >
        {children}
      </Component>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;