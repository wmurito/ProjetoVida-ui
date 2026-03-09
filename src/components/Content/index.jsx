import React from "react";

const Content = ({ children }) => (
    <div className="p-5 text-slate-500 h-screen overflow-y-auto scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-pink-400" style={{ gridArea: 'CT' }}>
        {children}
    </div>
);

export default Content;
