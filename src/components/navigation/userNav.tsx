import Link from "next/link";
import { useState } from "react";
import { useTheme, useMediaQuery, IconButton } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";

export default function UserNav() {
  const theme = useTheme();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const toggleMenu = (menuId: string): void => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const menuItems = [
    {
      id: "navEdit",
      label: "Editar Perfil",
      links: [
        { href: "/profile", label: "Editar información" },
        { href: "/profile/password", label: "Cambiar contraseña" },
      ],
    },
    {
      id: "navTickets",
      label: "Tiquetes",
      links: [
        { href: "/tickets/reservations", label: "Ver reservas" },
        { href: "/tickets/active", label: "Ver tiquetes activos" },
        { href: "/tickets/history", label: "Historial" },
      ],
    },
    { id: "navFinancial", label: "Área financiera", href: "/financial" },
    // { id: "navMessages", label: "Mensajes", href: "/messages" },
    // { id: "navNotifications", label: "Notificaciones", href: "/notifications" },
  ];

  return (
    <>
      {menuItems.map((item) => (
        <li key={item.id} className="relative">
          {item.links ? (
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
                  {item.links.map((link) => (
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
            <Link href={item.href}>
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
      <li>
        <Link href="/cart">
          <IconButton
            className="mr-6"
            style={{ color: theme.palette.background.paper }}
          >
            {/* Enable change number in icon */}
            <ShoppingCart style={{ fontSize: "2rem" }} />
          </IconButton>
        </Link>
      </li>
    </>
  );
}
