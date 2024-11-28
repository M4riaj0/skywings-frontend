import React from "react";
import Image from "next/image";

interface NoItemsAvailableProps {
  message: string;
}

const NoItemsAvailable: React.FC<NoItemsAvailableProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <Image
        src="/images/no_items.png"
        alt="No items available"
        width={160}
        height={160}
        className="object-contain"
      />
      <p className="text-gray-700 text-center text-lg font-medium">{message}</p>
    </div>
  );
};

export default NoItemsAvailable;
