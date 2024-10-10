'use client';

import Link from "next/link";
import Image from "next/image";
import { Logout, Login, Menu } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useRouter, usePathname } from "next/navigation";
import AdminNav from "./navigation/adminNav";
import UserNav from "./navigation/userNav";
import RootNav from "./navigation/rootNav";

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
    document.cookie = "token=; path=/;";
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
    router.refresh();
  };

  return (
    <nav
      className="p-0 shadow-md"
      style={{ backgroundColor: theme.palette.primary.main }}
    >
      <ul className="flex justify-between items-center">
        <li id="navHome">
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
          <li id="navLogIn">
            <Link href="/auth/login">
              <button
                className="font-bold py-1 px-3 rounded hover:border hover:rounded-2xl hover:border-gray-50"
                style={{
                  color: theme.palette.background.paper,
                  marginRight: "2rem",
                }}
              >
                <Login />
              </button>
            </Link>
          </li>
        )}
        {/* {window.innerWidth < 768 && (
          <li id="navMenu">
            <button
              className="font-bold py-1 px-3 rounded hover:border hover:rounded-2xl hover:border-gray-50"
              style={{
                color: theme.palette.background.paper,
                marginRight: "2rem",
              }}
            >
              <Menu />
            </button>
          </li>
        )} */}
        {
          // Verifica si el token existe y no es una página de autenticación
          searchToken && !isAuthPage && (role === 'USER') && (
            <UserNav />
          )
        }
        {
          searchToken && !isAuthPage && (role === 'ROOT') && (
            <RootNav />
          )
        }
        {
          searchToken && !isAuthPage && (role === 'ADMIN') && (
            <AdminNav />
          )
        }
        {
          // Verifica si el token existe y no es una página de autenticación
          searchToken && !isAuthPage && (
            <li id="navLogOut">
              <button
                onClick={handleLogout}
                className="font-bold p-3 rounded-full hover:border hover:border-gray-50"
                style={{
                  // backgroundColor: theme.palette.background.paper,
                  color: theme.palette.background.paper,
                  marginRight: "2rem",
                }}
              >
                <Logout />
              </button>
            </li>
          )
        }
      </ul>
    </nav>
  );
}

export default Navbar;
