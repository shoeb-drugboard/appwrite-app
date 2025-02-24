type User = {
  name: string;
  email: string;
  fullName: string;
  address: string;
  isLoggedIn?: boolean;
};

type UserActions = {
  setAddress: (address: User["address"]) => void;
  setName: (name: User["name"]) => void;
  setEmail: (email: User["email"]) => void;
  setFullName: (fullName: User["fullName"]) => void;
  setLoggedIn: (isLoggedIn: User["isLoggedIn"]) => void;
};

export type UserSlice = User & UserActions;
