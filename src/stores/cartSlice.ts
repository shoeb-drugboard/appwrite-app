export interface Product {
  _id: string;
  name: string;
  price: number;
  mainImage: {
    url: string;
  };
  quantity?: number;
}

export interface CartState {
  products: Product[];
  total: number;
}

interface CartActions {
  addProduct: (product: Product) => void;
  removeProduct: (productID: Product["_id"]) => void;
  incQuantity: (productID: Product["_id"]) => void;
  decQuantity: (productID: Product["_id"]) => void;
  getProduct: (productID: Product["_id"]) => Product | undefined;
  setTotal: (total: number) => void;
  resetCart: () => void;
}

export type CartSlice = CartState & CartActions;

export const initialState: CartState = {
  products: [],
  total: 0,
};
