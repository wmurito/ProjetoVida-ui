import React, { memo } from 'react';
import './SkeletonLoader.scss';

const SkeletonLoader = memo(({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  count = 1,
  className = ''
}) => {
  return (
    <div className={`skeleton-container ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="skeleton"
          style={{
            width,
            height,
            borderRadius,
            marginBottom: count > 1 ? '8px' : '0'
          }}
        />
      ))}
    </div>
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

export default SkeletonLoader;