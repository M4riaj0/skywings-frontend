import Link from "next/link";
import theme from "../../theme";

export default function AdminNav() {
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
      <li id="navVuelos">
        <button
          className="font-bold py-[20px] border-b-2 border-transparent  hover:border-gray-50"
          style={{
            color: theme.palette.background.paper,
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
        <ul className="absolute bg-white shadow-lg rounded mt-1 hidden">
          <li>
            <Link href="/flights/create">
              <button className="w-full font-bold py-1 px-5 rounded border-2 border-transparent hover:border-gray-300">
                Crear Vuelo
              </button>
            </Link>
          </li>
          <li>
            <Link href="/flights">
              <button className="w-full font-bold py-1 px-5 border-2 border-transparent hover:border-gray-300">
                Listar vuelos
              </button>
            </Link>
          </li>
          <li>
            {/* /vuelos/historial */}
            <Link href="/">
              <button className="w-full font-bold py-1 px-5 rounded border-2 border-transparent hover:border-gray-300">
                Historial
              </button>
            </Link>
          </li>
        </ul>
      </li>
      <li id="navMessages">
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
    </>
  );
}
