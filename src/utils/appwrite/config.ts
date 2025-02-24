import { Client, Account, Databases, Functions } from "node-appwrite";

export const client = new Client();
const EP: string =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "http://localhost";
const PRID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";
client.setEndpoint(EP).setProject(PRID).setKey(process.env.NEXT_PUBLIC_APPWRITE_KEY || ""); // Replace with your project ID
export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);

export { ID } from "node-appwrite";
