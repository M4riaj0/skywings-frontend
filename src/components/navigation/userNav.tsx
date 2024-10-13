import Link from "next/link";
import { useTheme } from "@mui/material/styles";

export default function UserNav() {
  const theme = useTheme();
  return (
    <>
      <li id="navEdit" className="hidden md:block">
        <Link href="/profile">
          <button
            className="font-bold py-1 px-3 rounded hover:border hover:rounded-2xl hover:border-gray-50"
            style={{
              // backgroundColor: theme.palette.background.paper,
              color: theme.palette.background.paper,
              marginRight: "2rem",
            }}
          >
            Editar Perfil
          </button>
        </Link>
      </li>
      <li id="navTickets" className="hidden md:block">
        <button
          className="font-bold py-1 px-3 rounded hover:border hover:rounded-2xl hover:border-gray-50"
          style={{
            color: theme.palette.background.paper,
            marginRight: "2rem",
          }}
          onClick={() => {
            const navTickets = document.getElementById("navTickets");
            if (navTickets) {
              const childUl = navTickets.querySelector("ul");
              if (childUl) {
                childUl.style.display =
                  childUl.style.display === "block" ? "none" : "block";
              }
            }
          }}
        >
          Tiquetes
        </button>
        <ul className="absolute bg-white shadow-lg rounded mt-5 hidden">
          <li>
            {/* /tickets/reservations */}
            <Link href="/">
              <button className="w-full font-bold py-1 px-3 rounded hover:border hover:border-gray-300">
          Ver reservas
              </button>
            </Link>
          </li>
          <li>
            {/* /tickets/active */}
            <Link href="/">
              <button className="w-full font-bold py-1 px-3 hover:border hover:border-gray-300">
          Ver tiquetes activos
              </button>
            </Link>
          </li>
          <li>
            {/* /tickets/history */}
            <Link href="/">
              <button className="w-full font-bold py-1 px-3 rounded hover:border hover:border-gray-300">
          Historial
              </button>
            </Link>
          </li>
        </ul>
      </li>
      <li id="navFinancial" className="hidden md:block">
        {/* /financial */}
        <Link href="/">
          <button
            className="font-bold py-1 px-3 rounded hover:border hover:rounded-2xl hover:border-gray-50"
            style={{
              color: theme.palette.background.paper,
              marginRight: "2rem",
            }}
          >
            Área financiera
          </button>
        </Link>
      </li>
      <li id="navMessages" className="hidden md:block">
        {/* /messages */}
        <Link href="/">
          <button
            className="font-bold py-1 px-3 rounded hover:border hover:rounded-2xl hover:border-gray-50"
            style={{
              color: theme.palette.background.paper,
              marginRight: "2rem",
            }}
          >
            Mensajes
          </button>
        </Link>
      </li>
      <li id="navNotifications" className="hidden md:block">
        {/* /notifications */}
        <Link href="/">
          <button
            className="font-bold py-1 px-3 rounded hover:border hover:rounded-2xl hover:border-gray-50"
            style={{
              color: theme.palette.background.paper,
              marginRight: "2rem",
            }}
          >
            Notificaciones
          </button>
        </Link>
      </li>
    </>
  );
}
