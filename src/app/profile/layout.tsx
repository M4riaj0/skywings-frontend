import React from 'react';

const ProfileLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex justify-center items-center h-[85vh]">
      <div className="w-full max-w-[600px] py-5 bg-white shadow-md rounded-lg text-center flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};

export default ProfileLayout;