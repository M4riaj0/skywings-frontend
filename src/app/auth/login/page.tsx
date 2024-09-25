"use client"
import { useState } from 'react';
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import NextLink from "next/link";
import ResetPassword from "@/components/resetPassword";

export default function Login() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = async (data: FormData) => {
        console.log("Inicio de sesión:", data);
        // Aquí manejarías el envío de los datos al backend
    };

    
    return (
        <Stack spacing={2} className="w-full max-w-xs">
            <Typography variant="h4" component="h1" align="center">Inicio de Sesión</Typography>
            <TextField label="Correo electrónico" variant="outlined" type="email"/>
            <TextField label="Contraseña" variant="outlined" type="password"/>
            <Typography  onClick={handleClickOpen} className="self-center"  
            sx={{
                fontSize: '0.875rem',
                color: 'gray',  
                textAlign: 'left', 
                display: 'block'
            }}>
                Olvidaste la contraseña?
            </Typography>
            <Button variant="contained">Iniciar Sesión</Button>
            <Link component={NextLink} href="/auth/signup" className="self-center">
                Regitrarse
            </Link>
            <ResetPassword open={open} onClose={handleClose} />
        </Stack>
    )
}