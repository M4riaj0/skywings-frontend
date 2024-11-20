import { ICartItem } from "@/app/schemas/cartSchemas";

const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createBook = async (cart: ICartItem) => {
  try {
    const response = await fetch(`${backend_url}/book`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(cart),
    });
    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

export const purchaseService = async (cart: ICartItem) => {
  try {
    const response = await fetch(`${backend_url}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(cart),
    });
    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}
