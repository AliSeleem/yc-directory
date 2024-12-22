import React from 'react';

const Load = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="relative">
        <div className="w-28 aspect-square border-4 border-t-transparent border-white rounded-full animate-spin">
        </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white font-semibold text-xl">Loading...</p>
      </div>
      </div>
    </div>
  );
};

export default Load;
