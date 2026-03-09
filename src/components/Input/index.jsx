import React from 'react';

const Input = ({ className = '', ...rest }) => {
  return (
    <input
      className={`w-full my-2.5 p-2.5 rounded-md border border-slate-400 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 ${className}`}
      {...rest}
    />
  );
};

export default Input;
