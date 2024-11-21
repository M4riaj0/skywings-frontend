import React from "react";

interface NoItemsAvailableProps {
  message: string;
}

const NoItemsAvailable: React.FC<NoItemsAvailableProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <img
        src="/images/no_items.png" 
        alt="No items available"
        className="w-40 h-40 object-contain"
      />
      <p className="text-gray-700 text-center text-lg font-medium">
        {message}
      </p>
    </div>
  );
};

export default NoItemsAvailable;
