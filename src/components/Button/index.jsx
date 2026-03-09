import React from 'react';

const Button = ({ children, className = '', ...rest }) => {
  return (
    <button
      className={`w-2/5 tracking-[4px] my-9 mx-0 p-3 rounded-full text-white bg-pink-400 transition-opacity hover:opacity-70 ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
