import { Client, Account, Databases } from "appwrite";

export const client = new Client();
const EP: string =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "http://localhost";
const PRID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
client.setEndpoint(EP).setProject(PRID); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);

export { ID } from "appwrite";
