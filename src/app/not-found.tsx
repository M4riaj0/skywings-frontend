import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="mt-3 text-2xl font-bold">Lo sentimos</h2>
      <Image
        src="/images/cartoon_sad_airplane.svg"
        alt="Not Found"
        width={1080}
        height={720}
        className="w-full max-w-md"
      />
      <p className="text-gray-500 mb-5">
        Estamos trabajando para mejorar tu experiencia. Te invitamos a regresar
        a la página principal
      </p>
      <Link href="/">
        <Button variant="contained" color="primary">Volver atrás</Button>
      </Link>
    </main>
  );
}
