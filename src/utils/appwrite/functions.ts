import { functions } from "./config";

const getFunction = async (name: string) => {
  try {
    const res = await functions.get(name);
    return res;
  } catch (error) {
    console.error("Error getting function:", error);
  }
};

getFunction("listProducts");
