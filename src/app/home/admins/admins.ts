interface Admin {
  username: string;
  email: string;
  password: string;
}

const BACKEND_URL = "http://localhost:4000";

export const getAdmins = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/users/admins`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      console.error("Error al obtener los administradores");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const addAdmin = async (newAdmin: Admin) => {
  try {
    const res = await fetch(`${BACKEND_URL}/users/newadmin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newAdmin),
    });

    if (res.ok) {
      console.log("Administrador creado exitosamente");
      return await res.json();
    } else {
      console.error("Error al crear el administrador");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export const deleteAdmin = async (username: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/users/deleteadmin`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({username: username}),
    });

    if (res.ok) {
      console.log("Administrador eliminado exitosamente");
      return await res.json();
    } else {
      console.error("Error al eliminar el administrador");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}