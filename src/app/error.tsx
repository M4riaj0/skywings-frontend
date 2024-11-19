'use client';
 
import { useEffect } from 'react';
import Link from 'next/link';
import Button from "@mui/material/Button";
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h2 className="text-center">Algo ha salido mal</h2>
      <p className="text-gray-500 mt-2">
        No pudimos cargar la información solicitada. Por favor, intenta de nuevo o regresa más tarde.
      </p>
      <Button variant="contained" color="primary" className='my-4'
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Intentar de nuevo
      </Button>
      <Link href='/'>
        <Button variant="contained" color="primary">Volver atrás</Button>
      </Link>
    </main>
  );
}