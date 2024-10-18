import React from 'react';

const ProfileLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="h-[80vh] mt-[1vh]">
      <section className="w-full mx-auto max-w-[600px] py-4 bg-white shadow-md rounded-lg text-center flex justify-center h-auto">
        {children}
      </section>
    </main>
  );
};

export default ProfileLayout;