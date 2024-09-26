'use client';

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import { usePathname } from "next/navigation"; // Cambia aquí
import { useRouter } from "next/navigation";

function Navbar() {
  const theme = useTheme();
  const pathname = usePathname(); // Usar usePathname para obtener la ruta actual
  const router = useRouter();
  
  // Verifica si la ruta actual es "/auth/login" o "/auth/register"
  const isAuthPage =
    pathname === "/auth/login" || pathname === "/auth/register";

  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const searchToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <nav
      className="p-0 shadow-md"
      style={{ backgroundColor: theme.palette.primary.main }}
    >
      <ul className="flex justify-between items-center">
        <li>
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="Logo" width={70} height={70} />
            <span
              className="font-bold py-1 ml-2 text-xl"
              style={{ color: theme.palette.background.paper }}
            >
              SkyWings
            </span>
          </Link>
        </li>
        {!searchToken &&  !isAuthPage && (
          <li className="my-auto">
            <Link href="/auth/login">
              <button
                className="font-bold py-1 px-3 rounded  hover:bg-blue-300 hover:text-white"
                style={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.primary.main,
                  marginRight: "2rem",
                }}
              >
                Iniciar sesión
              </button>
            </Link>
          </li>
        )}
        {
          searchToken && !isAuthPage && (role != 'ROOT') && (
            <li>
              <Link href="/home/profile">
                <button
                  className="font-bold py-1 px-3 rounded  hover:bg-blue-300 hover:text-white"
                  style={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.primary.main,
                    marginRight: "2rem",
                  }}
                >
                  Inicio
                </button>
              </Link>
            </li>
          )
        }
        {
          // Verifica si el token existe y no es una página de autenticación
          searchToken && !isAuthPage && (
            <li>
              <Link href="/home/profile/edit">
                <button
                  className="font-bold py-1 px-3 rounded  hover:bg-blue-300 hover:text-white"
                  style={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.primary.main,
                    marginRight: "2rem",
                  }}
                >
                  Editar Perfil
                </button>
              </Link>
            </li>
          )
        }
        {
          searchToken && !isAuthPage && (role === 'ROOT') && (
            <li>
              <Link href="/home/admins">
                <button
                  className="font-bold py-1 px-3 rounded  hover:bg-blue-300 hover:text-white"
                  style={{
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.primary.main,
                    marginRight: "2rem",
                  }}
                >
                  Gestionar Administradores
                </button>
              </Link>
            </li>
          )
        }
        {
          // Verifica si el token existe y no es una página de autenticación
          searchToken && !isAuthPage && (
            <li>
              <button
                onClick={handleLogout}
                className="font-bold py-1 px-3 rounded  hover:bg-blue-300 hover:text-white"
                style={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.primary.main,
                  marginRight: "2rem",
                }}
              >
                Cerrar sesión
              </button>
            </li>
          )
        }
      </ul>
    </nav>
  );
}

export default Navbar;
