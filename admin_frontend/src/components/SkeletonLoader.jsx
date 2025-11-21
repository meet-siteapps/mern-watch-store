// src/components/SkeletonLoader.jsx
import React from 'react';

const SkeletonLoader = ({ type = 'product', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return (
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
            <div className="bg-gray-700 w-full h-64"></div>
            <div className="p-5 text-center">
              <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto mb-3"></div>
              <div className="h-5 bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-10 bg-gray-700 rounded w-32 mx-auto"></div>
            </div>
          </div>
        );
      case 'navbar':
        return (
          <div className="flex items-center space-x-4 animate-pulse">
            <div className="h-8 w-32 bg-gray-700 rounded"></div>
            <div className="h-8 w-24 bg-gray-700 rounded"></div>
            <div className="h-8 w-24 bg-gray-700 rounded"></div>
          </div>
        );
      case 'text':
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        );
      case 'button':
        return (
          <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
        );
      default:
        return <div className="h-8 bg-gray-700 rounded animate-pulse"></div>;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};

export default SkeletonLoader;