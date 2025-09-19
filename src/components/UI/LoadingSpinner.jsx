import React, { memo } from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = memo(({ size = 'medium', text = 'Carregando...' }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner"></div>
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;