"use client";
import { useState } from 'react';
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import NextLink from "next/link";
import ResetPassword from "@/components/resetPassword";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Evita el comportamiento por defecto de enviar el formulario
        const data = { username, password };
        
        console.log("Inicio de sesión:", data);
        try {
            const response = await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log("Inicio de sesión exitoso");
                // Redirigir o manejar el éxito
            } else {
                console.error("Error al iniciar sesión");
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    };

    return (
        <form onSubmit={onSubmit} className='w-full'>
            <Stack spacing={2} className="w-full max-w-md">
                <Typography variant="h4" component="h1" align="center">Inicio de Sesión</Typography>
                <TextField
                    label="Nombre de usuario"
                    variant="outlined"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Contraseña"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                />
                <Typography onClick={handleClickOpen} className="self-center"
                    sx={{
                        fontSize: '0.875rem',
                        color: 'gray',
                        textAlign: 'left',
                        display: 'block'
                    }}>
                    ¿Olvidaste la contraseña?
                </Typography>
                <Button type="submit" variant="contained">Iniciar Sesión</Button>
                <Link component={NextLink} href="/auth/signup" className="self-center">
                    Registrarse
                </Link>
                <ResetPassword open={open} onClose={handleClose} />
            </Stack>
        </form>
    );
}
