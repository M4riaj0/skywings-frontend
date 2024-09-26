interface RegisterData {
  username: string;
  password: string;
  role: string;
  dni: string;
  name1: string;
  name2: string;
  surname1: string;
  surname2: string;
  email: string;
  gender: string;
  address: string;
  birthPlace: string;
  birthDate: Date;
  user_image: string;
}

interface LoginData {
  username: string;
  password: string;
}

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function handleLogin(data: LoginData) {
  console.log("Inicio de sesión:", data);
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
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
  console.log("Registro:", data);
  try {
    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
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
