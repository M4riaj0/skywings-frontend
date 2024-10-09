import Link from "next/link";
import { useTheme } from "@mui/material/styles";

export default function RootNav() {
  const theme = useTheme();
  return (
    <>
      <li>
        {/* This route must be changed to /changePassword or something like that */}
        <Link href='/'> 
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
      <li id="navAdmins" className="hidden md:block">
        <Link href="/admins">
          <button
            className="font-bold py-1 px-3 rounded hover:border hover:rounded-2xl hover:border-gray-50"
            style={{
              // backgroundColor: theme.palette.background.paper,
              color: theme.palette.background.paper,
              marginRight: "2rem",
            }}
          >
            Gestionar Administradores
          </button>
        </Link>
      </li>
    </>
  );
}
