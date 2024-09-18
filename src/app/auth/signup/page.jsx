import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import NextLink from "next/link";

export default function Signup() {
    return(
        <Stack spacing={2} className="w-full max-w-xs">
            <Typography variant="h4" component="h1" align="center">Registro</Typography>
            <TextField label="Correo electrónico" variant="outlined" type="email"/>
            <TextField label="Nombre de usuario" variant="outlined" type="text"/>
            <TextField label="Contraseña" variant="outlined" type="password"/>
            <TextField label="Confirmar Contraseña" variant="outlined" type="password"/>
            <Button variant="contained">Registrarse</Button>
            <Link component={NextLink} href="/auth/login" className="self-center">
                Iniciar sesión
            </Link>
        </Stack>
    )
}