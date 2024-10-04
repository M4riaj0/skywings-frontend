import {RegisterData, LoginData} from '@/app/schemas/users'

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function handleLogin(data: LoginData) {
  console.log(backendUrl);
  // console.log("Inicio de sesión:", data);
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
  // console.log("Registro:", data);

  const backendUrl = process.env.BACKEND_URL;
  console.log(backendUrl);
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
      console.error("Error al iniciar sesión");
    }
  } catch (error) {
    console.error("Error de red:", error);
  }
}
