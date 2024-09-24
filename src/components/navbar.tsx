"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@mui/material/styles';
import { usePathname } from 'next/navigation'; // Cambia aquí

function Navbar() {
  const theme = useTheme();
  const pathname = usePathname(); // Usar usePathname para obtener la ruta actual

  // Verifica si la ruta actual es "/auth/login" o "/auth/register"
  const isAuthPage = pathname === "/auth/login" || pathname === "/auth/register";

  return (
    <nav className='p-0 shadow-md' style={{ backgroundColor: theme.palette.primary.main }}>
      <ul className='flex justify-between items-center'>
        <li>
          <Link href="/" className='flex items-center'>
            <Image src="/images/logo.png" alt="Logo" width={70} height={70} />
            <span className='font-bold py-1 ml-2 text-xl' style={{ color: theme.palette.background.paper }}>SkyWings</span>
          </Link>
        </li>
        {!isAuthPage && (
          <li className='my-auto'>
            <Link href="/auth/login">
              <button 
                className='font-bold py-1 px-3 rounded  hover:bg-blue-300 hover:text-white' 
                style={{ backgroundColor: theme.palette.background.paper, color: theme.palette.primary.main, marginRight: '2rem' }}
              >
                Iniciar sesión
              </button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
