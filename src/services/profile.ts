import { RegisterData, ChangePassword } from "@/schemas/users";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getUser () {
  const token = localStorage.getItem("token");
  let username;
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    username = payload.username;
  }
  try {
    const response = await fetch(`${backendUrl}/users/getuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        username: username,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error obteniendo la información del usuario:", error);
  }
};

export async function updateUser (data: RegisterData) {
  console.log("Data en updateUser:", data);
  try {
    const response = await fetch(`${backendUrl}/users/updateuser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    console.log("Respuesta de la actualización del usuario:", response);
    const result = await response.json();
    console.log("Resultado de la actualización del usuario:");
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error actualizando la información del usuario:", error);
  }
}

export async function changePassword (data: ChangePassword) {
  try {
    const response = await fetch(`${backendUrl}/users/updatepassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al actualizar contraseña: ", error);
  }
}