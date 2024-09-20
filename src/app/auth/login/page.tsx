import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import NextLink from "next/link";

export default function Login() {
    return (
        <Stack spacing={2} className="w-full max-w-xs">
            <Typography variant="h4" component="h1" align="center">Inicio de Sesión</Typography>
            <TextField label="Correo electrónico" variant="outlined" type="email"/>
            <TextField label="Contraseña" variant="outlined" type="password"/>
            <Link component={NextLink} href="/auth/signup" className="self-center"  
            sx={{
                fontSize: '0.875rem',
                color: 'gray',  
                textAlign: 'left', 
                display: 'block'
            }}>
                Olvidaste la contraseña?
            </Link>
            <Button variant="contained">Iniciar Sesión</Button>
            <Link component={NextLink} href="/auth/signup" className="self-center">
                Regitrarse
            </Link>
        </Stack>
    )
}