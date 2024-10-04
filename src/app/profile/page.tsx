'use client';
import Image from "next/image";

function Profile() {
  return (
    <div className="mt-20 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">Bienvenido</h1>
      <Image src="/images/logo.png" alt="Logo" width={200} height={200}/>
      <h3>Más funcionalidades estarán disponibles próximamente</h3>
    </div>
  );
}

export default Profile;
