import React from 'react';

// === COMPONENTES BASE (TAILWIND) ===

// Botões
export const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, disabled, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 border rounded-md font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
    default: "px-4 py-2 text-sm"
  }[size] || sizeClasses.default;

  const variantClasses = {
    primary: "border-transparent bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500",
    secondary: "border-transparent bg-slate-600 text-white hover:bg-slate-700 focus:ring-slate-500",
    success: "border-transparent bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    warning: "border-transparent bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500",
    danger: "border-transparent bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
    outline: "border-teal-600 bg-transparent text-teal-600 hover:bg-teal-50 hover:text-teal-700 focus:ring-teal-500",
    ghost: "border-transparent bg-transparent text-teal-600 hover:bg-slate-100 hover:text-teal-700 focus:ring-teal-500"
  }[variant] || variantClasses.primary;

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
});
Button.displayName = 'Button';

// Inputs
const inputBaseClasses = "w-full border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors box-border";

export const Input = React.forwardRef(({ className, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs",
    default: "px-3 py-2 text-sm"
  }[size] || "px-3 py-2 text-sm";

  return (
    <input
      ref={ref}
      className={`${inputBaseClasses} ${sizeClasses} ${className || ''}`}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export const Select = React.forwardRef(({ children, className, size = 'default', ...props }, ref) => {
  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs",
    default: "px-3 py-2 text-sm"
  }[size] || "px-3 py-2 text-sm";

  return (
    <select
      ref={ref}
      className={`${inputBaseClasses} ${sizeClasses} appearance-none pr-8 ${className || ''}`}
      style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%3E%3Cpath%20fill%3D%22%23495057%22%20d%3D%22M10.293%203.293L6%207.586%201.707%203.293A1%201%200%2000.293%204.707l5%205a1%201%200%20001.414%200l5-5a1%201%200%2010-1.414-1.414z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '12px' }}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';

export const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={`${inputBaseClasses} px-3 py-2 min-h-[80px] resize-y font-inherit ${className || ''}`}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

// Checkbox e Radio
export const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={`w-4 h-4 text-teal-600 bg-white border-slate-300 rounded focus:ring-teal-500 focus:ring-2 cursor-pointer mr-2 accent-teal-600 ${className || ''}`}
    {...props}
  />
));
Checkbox.displayName = 'Checkbox';

export const Radio = React.forwardRef(({ className, ...props }, ref) => (
  <input
    type="radio"
    ref={ref}
    className={`w-4 h-4 text-teal-600 bg-white border-slate-300 focus:ring-teal-500 focus:ring-2 cursor-pointer mr-2 accent-teal-600 ${className || ''}`}
    {...props}
  />
));
Radio.displayName = 'Radio';

// Labels
export const Label = ({ children, className, ...props }) => (
  <label className={`block mb-1 font-medium text-sm text-slate-800 ${className || ''}`} {...props}>
    {children}
  </label>
);

export const CheckboxLabel = ({ children, className, ...props }) => (
  <label className={`flex items-center cursor-pointer text-sm text-slate-800 select-none ${className || ''}`} {...props}>
    {children}
  </label>
);

// Containers
export const Card = ({ children, className, padding, ...props }) => {
  const customPadding = padding ? { padding } : {};
  return (
    <div
      className={`bg-white border border-slate-200 rounded-lg shadow-sm ${padding ? '' : 'p-6'} ${className || ''}`}
      style={customPadding}
      {...props}
    >
      {children}
    </div>
  );
};

export const Container = ({ children, className, maxWidth = '1200px', ...props }) => (
  <div
    className={`mx-auto px-4 ${className || ''}`}
    style={{ maxWidth }}
    {...props}
  >
    {children}
  </div>
);

export const Grid = ({ children, className, cols, gap, style, ...props }) => {
  let gridStyle = {
    display: 'grid',
    gap: gap || '16px',
    gridTemplateColumns: cols ? `repeat(${cols}, 1fr)` : 'repeat(auto-fit, minmax(250px, 1fr))',
    ...style
  };

  return (
    <div className={`${className || ''}`} style={gridStyle} {...props}>
      {children}
    </div>
  );
};

export const Flex = ({ children, className, align = 'stretch', justify = 'flex-start', direction = 'row', wrap = 'nowrap', gap = '16px', style, ...props }) => {
  const flexStyle = {
    display: 'flex',
    alignItems: align,
    justifyContent: justify,
    flexDirection: direction,
    flexWrap: wrap,
    gap: gap,
    ...style
  };

  return (
    <div className={`${className || ''}`} style={flexStyle} {...props}>
      {children}
    </div>
  );
};

// Typography
export const Heading = ({ children, className, level = 1, ...props }) => {
  const Tag = `h${level >= 1 && level <= 6 ? level : 1}`;

  const sizeClasses = {
    1: "text-2xl",
    2: "text-xl",
    3: "text-lg",
    4: "text-base",
  }[level] || "text-2xl";

  return (
    <Tag className={`${sizeClasses} font-semibold text-slate-800 mb-4 mt-0 ${className || ''}`} {...props}>
      {children}
    </Tag>
  );
};

export const Text = ({ children, className, size = 'default', variant = 'default', ...props }) => {
  const sizeClasses = {
    sm: "text-sm",
    lg: "text-lg",
    default: "text-base"
  }[size] || sizeClasses.default;

  const colorClasses = {
    muted: "text-slate-500",
    success: "text-emerald-600",
    warning: "text-amber-500",
    danger: "text-rose-600",
    default: "text-slate-800"
  }[variant] || colorClasses.default;

  return (
    <p className={`${sizeClasses} ${colorClasses} m-0 mb-2 ${className || ''}`} {...props}>
      {children}
    </p>
  );
};

// Alerts
export const Alert = ({ children, className, variant = 'info', ...props }) => {
  const variantClasses = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    info: "bg-sky-50 text-sky-800 border-sky-200"
  }[variant] || "bg-slate-50 text-slate-800 border-slate-200";

  return (
    <div className={`p-4 rounded-md border mb-4 ${variantClasses} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

// Loading
export const Spinner = ({ className, size = '20px', ...props }) => (
  <div
    className={`border-2 border-slate-200 border-t-teal-600 rounded-full animate-spin ${className || ''}`}
    style={{ width: size, height: size }}
    {...props}
  />
);

// Overlay (Modal Background)
export const Overlay = ({ children, className, ...props }) => (
  <div
    className={`fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 backdrop-blur-sm ${className || ''}`}
    {...props}
  >
    {children}
  </div>
);

// Exports para retrocompatibilidade onde importam "tokens" do UI/index.js (apesar de agora recomendarmos pular eles e usar classes Tailwind)
export const tokens = {
  colors: {
    primary: '#0d9488', // teal-600
    primaryHover: '#0f766e', // teal-700
    secondary: '#475569', // slate-600
    success: '#10b981', // emerald-500
    warning: '#f59e0b', // amber-500
    danger: '#e11d48', // rose-600
    info: '#0ea5e9', // sky-500
    light: '#f8fafc', // slate-50
    dark: '#1e293b', // slate-800
    muted: '#64748b', // slate-500
    border: '#e2e8f0', // slate-200
    background: '#ffffff',
    surface: '#f8fafc' // slate-50
  },
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    xxl: '3rem' // 48px
  },
  typography: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
    xxxl: '2rem'
  },
  radius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  }
};
