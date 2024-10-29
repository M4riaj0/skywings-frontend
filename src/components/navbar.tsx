"use client";

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

  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const searchToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleLogout = () => {
    document.cookie = "token=; path=/;";
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
    router.refresh();
  };

  const showMenu = () => {
    const userNav = document.getElementById("menu");
    userNav?.classList.toggle("hidden");
    const navEditList = document.getElementById("navEdit");
    const navVuelosList = document.getElementById("navVuelos");
    const navTicketsList = document.getElementById("navTickets");
    if (navEditList) {
      const childUl = navEditList.getElementsByTagName("ul");
      childUl.item(0)?.classList.toggle("absolute");
    }
    if (navVuelosList) {
      const childUl = navVuelosList.getElementsByTagName("ul");
      childUl.item(0)?.classList.toggle("absolute");
    }
    if (navTicketsList) {
      const childUl = navTicketsList.getElementsByTagName("ul");
      childUl.item(0)?.classList.toggle("absolute");
    }
  };

  return (
    <nav
      className="p-0 m-0 shadow-md w-full h-[13vh]"
      style={{ backgroundColor: theme.palette.primary.main }}
    >
      <ul className="flex justify-between items-center h-full">
        <li id="navHome" className="ml-4">
          <Link href="/" className="flex">
            <Image src="/images/logo.png" alt="Logo" width={64} height={64} />
            <span
              className="font-bold my-auto text-xl"
              style={{ color: theme.palette.background.paper }}
            >
              SkyWings
            </span>
          </Link>
        </li>
        { !searchToken && !isAuthPage && (
          <li id="navLogIn">
            <Link href="/auth/login">
              <button
                className="font-bold my-auto mr-5 border-b-2 border-transparent  hover:border-gray-50 hidden sm:block"
                style={{
                  color: theme.palette.background.paper,
                }}
              >
                Iniciar sesión <Login />
              </button>
              <button
                className="font-bold p-3 mr-4 rounded-full border border-transparent hover:border-gray-50 sm:hidden"
                style={{
                  color: theme.palette.background.paper,
                }}
              >
                <Login />
              </button>
            </Link>
          </li>
        )}
        { // Verifica si el token existe y no es una página de autenticación
          searchToken && !isAuthPage && (
            <>
              <li
                className={`w-4/5 flex justify-end ${
                  role === "ROOT" ? "sm:block" : "md:block"
                } md:w-9/12`}
              >
                <button
                  onClick={showMenu}
                  className={`font-bold p-3 mr-2 rounded-full hover:border hover:border-gray-50 ${
                    role === "ROOT" ? "sm:hidden" : "md:hidden"
                  }`}
                  style={{
                    color: theme.palette.background.paper,
                  }}
                >
                  <Menu />
                </button>
                {role === "USER" && (
                  <ul
                    id="userNav"
                    className="hidden md:flex justify-evenly sm:ml-4 lg:ml-0"
                  >
                    <UserNav />
                  </ul>
                )}
                {role === "ROOT" && (
                  <ul id="rootNav" className="hidden sm:flex justify-evenly">
                    <RootNav />
                  </ul>
                )}
                {role === "ADMIN" && (
                  <ul
                    id="userNav"
                    className="hidden md:flex justify-evenly sm:ml-4 lg:ml-0"
                  >
                    <AdminNav />
                  </ul>
                )}
              </li>
            </>
          )
        }
        { // Verifica si el token existe y no es una página de autenticación
          searchToken && !isAuthPage && (
            <li id="navLogOut">
              <button
                onClick={handleLogout}
                className="font-bold p-3 mr-3 rounded-full border border-transparent hover:border-gray-50 hidden sm:block"
                style={{
                  color: theme.palette.background.paper,
                }}
              >
                <Logout />
              </button>
            </li>
          )
        }
      </ul>
      {// Verifica si el token existe y no es una página de autenticación
        searchToken && !isAuthPage && (
          <div
            id="menu"
            className="absolute right-0 h-[88vh] top-[12vh] w-2/5 h-screen border-t border-gray-50 hidden"
            style={{ backgroundColor: theme.palette.primary.main }}
          >
            <ul
              id="menuList"
              className="flex flex-col text-center justify-center"
            >
              <UserNav />
            </ul>
            {role === "USER" && <UserNav />}
            {role === "ROOT" && <RootNav />}
            {role === "ADMIN" && <AdminNav />}
          </div>
        )
      }
    </nav>
  );
}

export default Navbar;
