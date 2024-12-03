'use client';

import { useState } from 'react';
import { Button, Link, Stack, TextField, Typography, Alert } from "@mui/material";
import NextLink from "next/link";
import ResetPassword from "@/components/resetPassword";
import { handleLogin } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const router = useRouter();

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = { username, password };
    const res = await handleLogin(data);
    console.log("res:: ", res);
    const token = res?.access_token;
    const role = res?.role;
    const access = res?.numberLogins;
    if (token) {
      // Guardar el token en el local storage y redirigir al usuario
      document.cookie = `token=${token}; path=/;`; //Debe cambiarse el guardado por cookies
      localStorage && localStorage.setItem("token", token);
      localStorage && localStorage.setItem("role", role);
      router.refresh();
      if (role == "ROOT") router.push("/admins");
      else if (role == "ADMIN" && access == 1) router.push("/profile/password");
      // else if (role == "ADMIN") router.push("/flights");
      else router.push("/");
    } else {
      setErrorMessage("Usuario o contraseña incorrectos");
      setPassword("");
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <Stack spacing={2} className="w-full max-w-md">
        <Typography variant="h4" component="h1" align="center">
          Inicio de Sesión
        </Typography>
        {errorMessage && (
          <Alert severity="error">{errorMessage}</Alert>
        )}
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
        <Typography
          onClick={handleClickOpen}
          className="self-center"
          sx={{
            fontSize: "0.875rem",
            color: "gray",
            textAlign: "left",
            display: "block",
          }}
        >
          ¿Olvidaste la contraseña?
        </Typography>
        <Button type="submit" variant="contained">
          Iniciar Sesión
        </Button>
        <Link component={NextLink} href="/auth/signup" className="self-center">
          Registrarse
        </Link>
        <ResetPassword open={open} onClose={handleClose} />
      </Stack>
    </form>
  );
}
