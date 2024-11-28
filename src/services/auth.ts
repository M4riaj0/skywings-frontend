import {RegisterData, LoginData} from '@/schemas/users'
import { getAllUsers } from './admins';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface User {
  email: string;
  dni: string;
  username: string;
}

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

export async function checkUserAvailability(data: { email: string, dni: string, username: string }, currentUser?: User) {
  const allUser = await getAllUsers();
  const user = allUser.find((user: User) => 
    user.email === data.email || 
    user.dni === data.dni || 
    user.username === data.username
  );

  if (user && (!currentUser || user.email !== currentUser.email)) { // Skip check if editing the same user
    if (user.email === data.email) {
      return ["El correo electrónico ya está en uso", false];
    } else if (user.dni === data.dni) {
      return ["El DNI ya está en uso", false];
    } else if (user.username === data.username) {
      return ["El nombre de usuario ya está en uso", false];
    }
  }

  return ["Usuario disponible", true];
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
