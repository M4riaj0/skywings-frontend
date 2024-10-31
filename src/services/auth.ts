import {RegisterData, LoginData} from '@/app/schemas/users'

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function handleLogin(data: LoginData) {
  try {
    const response = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Error al iniciar sesión");
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
}

export async function handleRegister(data: RegisterData) {
  try {
    const response = await fetch(`${backendUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log(response.json());
      return "Usuario registrado";
      // Redirigir o manejar el éxito
    } else {
      console.error("Error al registrarse");
      const error = await response.json();
      return error;
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
}
