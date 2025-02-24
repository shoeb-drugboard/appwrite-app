import { create } from "zustand";
import { UserSlice } from "./userSlice";
import { CartSlice, Product, CartState, initialState } from "./cartSlice";

interface RootStore extends UserSlice, CartSlice {}

const useStore = create<RootStore>((set, get) => ({
  ...initialState,
  incQuantity: (productID: Product["_id"]) =>
    set((state: CartState) => {
      const product = state.products.find((p) => p._id === productID);
      if (!product) return state;

      return {
        ...state,
        products: state.products.map((p) =>
          p._id === productID ? { ...p, quantity: (p.quantity || 0) + 1 } : p
        ),
        total: state.total + product.price,
      };
    }),

  decQuantity: (productID: Product["_id"]) =>
    set((state: CartState) => {
      const product = state.products.find((p) => p._id === productID);
      if (!product || !product.quantity) return state;

      return {
        ...state,
        products: state.products
          .map((p) =>
            p._id === productID && p.quantity
              ? { ...p, quantity: p.quantity - 1 }
              : p
          )
          .filter((p) => p._id !== productID || (p.quantity && p.quantity > 0)),
        total: state.total - product.price,
      };
    }),

  getProduct: (productID: Product["_id"]) =>
    get().products.find((pr) => pr._id === productID),

  addProduct: (product: Product) =>
    set((state: CartState) => ({
      products: [...state.products, { ...product, quantity: 1 }],
      total: state.total + product.price * 1,
    })),

  removeProduct: (productID: Product["_id"]) =>
    set((state: CartState) => ({
      products: state.products.filter((pr) => pr._id !== productID),
      total:
        state.total -
        (state.products.find((pr) => pr._id === productID)?.price || 0) *
          (state.products.find((pr) => pr._id === productID)?.quantity || 1),
    })),

  setTotal: (total: number) => set({ total }),

  resetCart: () => set({ ...initialState }),
  name: "John",
  email: "johndoe@gmail.com",
  fullName: "John Doe",
  address: "",
  setAddress: (address: UserSlice["address"]) =>
    set((state) => ({ ...state, address })),
  setName: (name: UserSlice["name"]) => set((state) => ({ ...state, name })),
  setEmail: (email: UserSlice["email"]) =>
    set((state) => ({ ...state, email })),
  setFullName: (fullName: UserSlice["fullName"]) =>
    set((state) => ({ ...state, fullName })),
  setLoggedIn(isLoggedIn) {
    set({ isLoggedIn });
  },
}));

export default useStore;
