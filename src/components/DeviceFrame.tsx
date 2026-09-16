import React from 'react';

interface DeviceFrameProps {
  isMobileFrame: boolean;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ isMobileFrame, children }) => {
  if (!isMobileFrame) {
    return (
      <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col">
        <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex items-center justify-center sm:py-4 sm:px-2">
      {/* On mobile screens, take 100% natural width and height. On desktop, show refined frame. */}
      <div className="w-full sm:max-w-[440px] min-h-screen sm:min-h-[880px] sm:max-h-[92vh] sm:rounded-3xl bg-stone-950 border-0 sm:border sm:border-stone-800 sm:shadow-2xl flex flex-col overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};
