import Link from "next/link";
import { useTheme } from "@mui/material/styles";

export default function UserNav() {
  const theme = useTheme();
  return (
    <>
      <li id="navEdit">
        <button
          className="font-bold py-[20px] border-b-2 border-transparent  hover:border-gray-50"
          style={{
            color: theme.palette.background.paper,
          }}
          onClick={() => {
            const navEdit = document.getElementById("navEdit");
            if (navEdit) {
              const childUl = navEdit.querySelector("ul");
              if (childUl) {
                childUl.style.display =
                  childUl.style.display === "block" ? "none" : "block";
              }
            }
          }}
        >
          Editar Perfil
        </button>
        <ul className="absolute bg-white shadow-lg rounded mt-1 hidden">
          <li>
            <Link href="/profile">
              <button className="w-full font-bold py-1 px-5 rounded border-2 border-transparent hover:border-gray-300">
                Editar información
              </button>
            </Link>
          </li>
          <li>
            <Link href="/profile/password">
              <button className="w-full font-bold py-1 px-5 rounded border-2 border-transparent hover:border-gray-300">
                Cambiar contraseña
              </button>
            </Link>
          </li>
        </ul>
      </li>
      <li id="navTickets">
        <button
          className="font-bold py-[20px] border-b-2 border-transparent  hover:border-gray-50"
          style={{
            color: theme.palette.background.paper,
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
        <ul className="absolute bg-white shadow-lg rounded mt-1 hidden">
          <li>
            {/* /tickets/reservations */}
            <Link href="/">
              <button className="w-full font-bold py-1 px-5 rounded border-2 border-transparent hover:border-gray-300">
                Ver reservas
              </button>
            </Link>
          </li>
          <li>
            {/* /tickets/active */}
            <Link href="/">
              <button className="w-full font-bold py-1 px-5 rounded border-2 border-transparent hover:border-gray-300">
                Ver tiquetes activos
              </button>
            </Link>
          </li>
          <li>
            {/* /tickets/history */}
            <Link href="/">
              <button className="w-full font-bold py-1 px-5 rounded border-2 border-transparent hover:border-gray-300">
                Historial
              </button>
            </Link>
          </li>
        </ul>
      </li>
      <li id="financial">
        {/* /financial */}
        <Link href="/">
          <button
            className="font-bold py-[20px] border-b-2 border-transparent  hover:border-gray-50"
            style={{
              color: theme.palette.background.paper,
            }}
          >
            Área financiera
          </button>
        </Link>
      </li>
      <li id="messages">
        {/* /messages */}
        <Link href="/">
          <button
            className="font-bold py-[20px] border-b-2 border-transparent  hover:border-gray-50"
            style={{
              color: theme.palette.background.paper,
            }}
          >
            Mensajes
          </button>
        </Link>
      </li>
      <li id="navNotifications">
        {/* /notifications */}
        <Link href="/">
          <button
            className="font-bold py-[20px] border-b-2 border-transparent  hover:border-gray-50"
            style={{
              color: theme.palette.background.paper,
            }}
          >
            Notificaciones
          </button>
        </Link>
      </li>
    </>
  );
}
