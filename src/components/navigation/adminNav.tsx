import Link from "next/link"
import theme from "../../theme"

export default function AdminNav() {
  return (
    <>
      <li id="navPass" className="hidden md:block">
        <Link href="/">
          <button
            className="font-bold py-1 px-3 rounded hover:border hover:rounded-2xl hover:border-gray-50"
            style={{
              color: theme.palette.background.paper,
              marginRight: "2rem",
            }}
          >
            Cambiar contraseña
          </button>
        </Link>
      </li>
      <li id="navEdit" className="hidden md:block">
        <Link href="/profile/edit">
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
      <li id="navVuelos" className="hidden md:block">
        <button
          className="font-bold py-1 px-3 rounded hover:border hover:rounded-2xl hover:border-gray-50"
          style={{
            color: theme.palette.background.paper,
            marginRight: "2rem",
          }}
          onClick={() => {
            const navVuelos = document.getElementById("navVuelos");
            if (navVuelos) {
              const childUl = navVuelos.querySelector("ul");
              if (childUl) {
                childUl.style.display =
                  childUl.style.display === "block" ? "none" : "block";
              }
            }
          }}
        >
          Gestionar vuelos
        </button>
        <ul className="absolute bg-white shadow-lg rounded mt-5 hidden">
          <li>
            <Link href="/tickets/reservations">
              <button className="w-full font-bold py-1 px-3 rounded hover:border hover:border-gray-300">
          Ver reservas
              </button>
            </Link>
          </li>
          <li>
            <Link href="/tickets/active">
              <button className="w-full font-bold py-1 px-3 hover:border hover:border-gray-300">
          Ver tiquetes activos
              </button>
            </Link>
          </li>
          <li>
            <Link href="/tickets/history">
              <button className="w-full font-bold py-1 px-3 rounded hover:border hover:border-gray-300">
          Historial
              </button>
            </Link>
          </li>
        </ul>
      </li>
      <li id="navMessages" className="hidden md:block">
        <Link href="/messages">
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
    </>
  )
}
