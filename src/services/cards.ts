import { ICard, changeBalance } from "@/schemas/cards";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getCards = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return;
  }
  const payload = JSON.parse(atob(token.split('.')[1]));
  const propietary = payload.dni;
  try {
    const res = await fetch(`${BACKEND_URL}/financial/user/${propietary}`, {
      cache: "no-cache",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      return await res.json();
    } else {
      console.error("Error al obtener las tarjetas");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

  export const addCard = async (newCard: ICard) => {
    try {
      const res = await fetch(`${BACKEND_URL}/financial/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newCard),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Administrador creado exitosamente");
        return data;
      } else {
        console.error("Error al crear el administrador");
        return data;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  export const updateCard = async (cardData: changeBalance) => {
    try {
        const res = await fetch(`${BACKEND_URL}/financial/update`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(cardData),
        });
    
        if (res.ok) {
          console.log("Saldo actualizado exitosamente");
          return await res.json();
        } else {
          console.error("Error al actualizar el saldo");
        }
      } catch (error) {
        console.error("Error:", error);
      }
  };

  export const deleteCard = async (number: string) => {
    try {
      const res = await fetch(`${BACKEND_URL}/financial/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ number: number }),
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
  };