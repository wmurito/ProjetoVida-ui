import React from 'react';

export const InputLabel = ({ htmlFor, children, className }) => (
    <label htmlFor={htmlFor} className={`block text-sm font-medium text-slate-700 mb-1.5 ${className || ''}`}>
        {children}
    </label>
);

export const CheckboxLabel = ({ htmlFor, children, className }) => (
    <label htmlFor={htmlFor} className={`flex items-center cursor-pointer text-sm text-slate-700 font-medium select-none ${className || ''}`}>
        {children}
    </label>
);

export const StyledInput = React.forwardRef(({ className, ...props }, ref) => (
    <input
        ref={ref}
        className={`w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                   focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500
                   disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
                   transition-colors ${className || ''}`}
        {...props}
    />
));
StyledInput.displayName = 'StyledInput';

export const StyledSelect = React.forwardRef(({ children, className, ...props }, ref) => (
    <select
        ref={ref}
        className={`w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm
                   focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500
                   disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200
                   transition-colors appearance-none ${className || ''}`}
        style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%3E%3Cpath%20fill%3D%22%23495057%22%20d%3D%22M10.293%203.293L6%207.586%201.707%203.293A1%201%200%2000.293%204.707l5%205a1%201%200%20001.414%200l5-5a1%201%200%2010-1.414-1.414z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '12px', paddingRight: '30px' }}
        {...props}
    >
        {children}
    </select>
));
StyledSelect.displayName = 'StyledSelect';

export const StyledCheckbox = React.forwardRef(({ className, ...props }, ref) => (
    <input
        type="checkbox"
        ref={ref}
        className={`w-4 h-4 text-pink-600 bg-white border-slate-300 rounded focus:ring-pink-500 focus:ring-2 disabled:bg-slate-100 disabled:border-slate-200 disabled:cursor-not-allowed cursor-pointer mr-2.5 transition-colors ${className || ''}`}
        {...props}
    />
));
StyledCheckbox.displayName = 'StyledCheckbox';

export const StyledRadio = React.forwardRef(({ className, ...props }, ref) => (
    <input
        type="radio"
        ref={ref}
        className={`w-4 h-4 text-pink-600 bg-white border-slate-300 focus:ring-pink-500 focus:ring-2 disabled:bg-slate-100 disabled:border-slate-200 disabled:cursor-not-allowed cursor-pointer mr-2.5 transition-colors ${className || ''}`}
        {...props}
    />
));
StyledRadio.displayName = 'StyledRadio';

export const ErrorText = ({ children, className }) => (
    <span className={`text-rose-500 text-xs mt-1.5 font-medium block ${className || ''}`}>{children}</span>
);

export const FieldContainer = ({ className, children }) => (
    <div className={`flex flex-col w-full ${className || ''}`}>
        {children}
    </div>
);

export const FormGrid = ({ children, className, style }) => (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-5 gap-y-6 ${className || ''}`} style={style}>
        {children}
    </div>
);

export const SectionContent = ({ children, className, style }) => (
    <div className={`mt-2 ${className || ''}`} style={style}>
        {children}
    </div>
);

export const AddMemberButton = ({ children, className, ...props }) => (
    <button
        className={`bg-pink-600 hover:bg-pink-700 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-colors focus:ring-2 focus:ring-pink-500 focus:outline-none flex items-center justify-center gap-2 my-2 ${className || ''}`}
        {...props}
    >
        {children}
    </button>
);

export const AddMoreButton = ({ children, className, ...props }) => (
    <button
        className={`bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-200 font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 text-sm mt-3 ${className || ''}`}
        {...props}
    >
        {children}
    </button>
);

export const ActionButtons = ({ children, className }) => (
    <div className={`absolute top-4 right-4 ${className || ''}`}>
        {children}
    </div>
);

export const RemoveButton = ({ children, className, ...props }) => (
    <button
        className={`bg-transparent text-slate-400 hover:text-rose-500 transition-colors p-1 ${className || ''}`}
        {...props}
    >
        {children}
    </button>
);

export const ListContainer = ({ children, className }) => (
    <div className={`w-full relative p-4 border border-slate-200 bg-slate-50 rounded-lg mb-3 mt-2 ${className || ''}`}>
        {children}
    </div>
);

export const Section = ({ children, className }) => (
    <div className={`mb-6 pb-4 border-b border-slate-200 last:border-0 last:mb-2 ${className || ''}`}>
        {children}
    </div>
);

export const SectionTitle = ({ children, className }) => (
    <h2 className={`text-lg font-semibold text-slate-800 mb-4 pb-1 border-b-2 border-pink-500 inline-block ${className || ''}`}>
        {children}
    </h2>
);

export const TreatmentSubSection = ({ children, className }) => (
    <div className={`bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 last:mb-0 ${className || ''}`}>
        {children}
    </div>
);

export const SubSectionHeader = ({ children, className, style }) => (
    <div className={`flex flex-col gap-2 mb-4 ${className || ''}`} style={style}>
        {children}
    </div>
);

export const SubSectionTitle = ({ children, className }) => (
    <h3 className={`text-base font-semibold text-slate-700 pb-1 border-b border-slate-300 inline-block ${className || ''}`}>
        {children}
    </h3>
);

export const AddSubButton = ({ children, className, ...props }) => (
    <button
        className={`bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-medium px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 text-xs mt-2 self-start ${className || ''}`}
        {...props}
    >
        {children}
    </button>
);
