import Link from "next/link";
import { useState } from "react";
import theme from "../../theme";
import { useMediaQuery } from "@mui/material";

const menuItems = [
  {
    id: "navEdit",
    label: "Editar Perfil",
    options: [
      { href: "/profile", label: "Editar información" },
      { href: "/profile/password", label: "Cambiar contraseña" },
    ],
  },
  {
    id: "navVuelos",
    label: "Gestionar vuelos",
    options: [
      { href: "/flights/create", label: "Crear Vuelo" },
      { href: "/flights", label: "Listar vuelos" },
      { href: "/flights/history", label: "Historial" },
    ],
  },
  // { id: "navMessages", label: "Mensajes", href: "/messages" },
];

export default function AdminNav() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const toggleMenu = (id: string) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  return (
    <>
      {menuItems.map((item) => (
        <li key={item.id} className="relative">
          {item.options ? (
            <>
              <button
                className="font-bold py-[20px] border-b-2 border-transparent hover:border-gray-50"
                style={{ color: theme.palette.background.paper }}
                onClick={() => toggleMenu(item.id)}
              >
                {item.label}
              </button>
              {openMenu === item.id && (
                <ul
                  className={`${
                    isSmallScreen ? "relative" : "absolute"
                  } top-full mt-1 bg-white shadow-lg rounded z-50`}
                  style={{ minWidth: "180px" }}
                >
                  {item.options.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>
                        <button
                          className="w-full font-bold py-1 px-5 rounded border-2 border-transparent hover:border-gray-300"
                          onClick={() => toggleMenu(item.id)}
                        >
                          {link.label}
                        </button>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <Link href={item.options}>
              <button
                className="font-bold py-[20px] border-b-2 border-transparent hover:border-gray-50"
                style={{ color: theme.palette.background.paper }}
              >
                {item.label}
              </button>
            </Link>
          )}
        </li>
      ))}
    </>
  );
}
