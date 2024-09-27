import Image from "next/image";

// export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="mt-20 flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">Bienvenido</h1>
      <Image src="/images/logo.png" alt="Logo" width={200} height={200}/>
      <h3>Más funcionalidades estarán disponibles próximamente</h3>
    </div>
  );
}
