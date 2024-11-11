import { useReducer, createContext } from "react";

export const CartContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

interface CartItem {
  code: string;
  departure: string;
  arrival: string;
  departureDate: string;
  arrivalDate: string;
  ticketClass: string;
  price: number;
  quantity: number;
}

interface State {
  cart: CartItem[];
}

type Action = 
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string };

const initialState: State = {
  cart: [],
};

const reducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const newItem = action.payload;
      const existItem = state.cart.find(
        (item: CartItem) => item.code === newItem.code
      );

      if (existItem) {
        return {
          ...state,
          cart: state.cart.map((item: CartItem) =>
            item.code === newItem.code
              ? newItem
              : item
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, newItem],
        };
      }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item: CartItem) => item.code !== action.payload),
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
};
