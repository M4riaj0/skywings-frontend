import Link from "next/link";
import { useTheme } from "@mui/material/styles";

export default function RootNav() {
  const theme = useTheme();
  return (
    <>
      <li id="changePass">
        {/* This route must be changed to /changePassword or something like that */}
        <Link href="/">
          <button
            className="font-bold py-[20px] border-b-2 border-transparent  hover:border-gray-50"
            style={{
              color: theme.palette.background.paper,
            }}
          >
            Cambiar contraseña
          </button>
        </Link>
      </li>
      <li id="admins">
        <Link href="/admins">
          <button
            className="font-bold py-[20px] border-b-2 border-transparent  hover:border-gray-50"
            style={{
              // backgroundColor: theme.palette.background.paper,
              color: theme.palette.background.paper,
            }}
          >
            Gestionar Administradores
          </button>
        </Link>
      </li>
    </>
  );
}
