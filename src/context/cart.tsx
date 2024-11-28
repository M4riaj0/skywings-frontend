"use client";

import { ICartItem, ITicket } from "@/schemas/cartSchemas";
import { useReducer, createContext, useContext } from "react";

const CartContext = createContext<
  { state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

interface State {
  cart: ICartItem[];
}

type Action =
  | { type: "ADD_TO_CART"; payload: ICartItem }
  | { type: "ADD_PASSENGERS"; payload: { flightCode: string, tickets: ITicket[] } }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "CHECK_CART" };

const initialState: State = {
  cart: [],
};

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItem = action.payload;
      const existItem = state.cart.find(
        (item: ICartItem) => item.flight.code === newItem.flight.code
      );

      if (existItem) {
        return {
          ...state,
          cart: state.cart.map((item: ICartItem) =>
            item.flight.code === newItem.flight.code ? existItem : item
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, newItem],
        };
      }
    case "ADD_PASSENGERS":
      console.log(action.payload);
      return {
        ...state,
        cart: state.cart.map((item: ICartItem) =>
          item.flight.code === action.payload.flightCode
            ? {
                flight: item.flight,
                tickets: action.payload.tickets,
              }
            : item
        ),
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter(
          (item: ICartItem) => item.flight.code !== action.payload
        ),
      };
    case "CLEAR_CART":
      return {
        ...state,
        cart: [],
      };
    case "CHECK_CART":
      return state;
  }
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("Cart context is not available. Make sure you use CartProvider to wrap your components.");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
