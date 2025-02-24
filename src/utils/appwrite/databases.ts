import { databases } from "./config";
import { ID, Permission, Query, Models } from "node-appwrite";

type DocumentResponse = Models.Document;
type DocumentListResponse = Models.DocumentList<Models.Document>;

interface CollectionConfig {
  dbId: string;
  id: string;
  name: string;
}

type DatabasePayload = Record<string, unknown>;

interface DatabaseMethods<T extends DatabasePayload> {
  create: (
    payload: T,
    permissions?: Permission[],
    id?: string
  ) => Promise<DocumentResponse>;
  update: (
    id: string,
    payload: Partial<T>,
    permissions?: Permission[]
  ) => Promise<DocumentResponse>;
  delete: (id: string) => Promise<DocumentResponse>;
  list: (queries?: string[] | Query[]) => Promise<DocumentListResponse>;
  get: (id: string) => Promise<DocumentResponse>;
}

interface DatabaseCollections {
  [key: string]: DatabaseMethods<DatabasePayload>;
}

const db: DatabaseCollections = {};

const collections: readonly CollectionConfig[] = [
  {
    dbId: process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string,
    id: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USERS_ID as string,
    name: "users",
  },
  {
    dbId: process.env.NEXT_PUBLIC_APPWRITE_DB_ID as string,
    id: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_PRODUCTS_ID as string,
    name: "products",
  }
] as const;

collections.forEach((col) => {
  db[col.name] = {
    create: (
      payload: DatabasePayload,
      permissions?: Permission[],
      id = ID.unique()
    ): Promise<DocumentResponse> =>
      databases.createDocument(
        col.dbId,
        col.id,
        id,
        payload,
        permissions?.map((p) => p.toString())
      ),

    update: (
      id: string,
      payload: DatabasePayload,
      permissions?: Permission[]
    ): Promise<DocumentResponse> =>
      databases.updateDocument(
        col.dbId,
        col.id,
        id,
        payload,
        permissions?.map((p) => p.toString())
      ),

    delete: async (id: string): Promise<DocumentResponse> => {
      try {
        return (await databases.deleteDocument(
          col.dbId,
          col.id,
          id
        )) as unknown as DocumentResponse;
      } catch (error) {
        console.error(`Error deleting document ${id} from ${col.name}:`, error);
        throw error;
      }
    },

    list: async (
      queries: string[] | Query[] = []
    ): Promise<DocumentListResponse> => {
      try {
        const processedQueries = queries.map((q) =>
          q instanceof Query ? q.toString() : q
        );
        return await databases.listDocuments(
          col.dbId,
          col.id,
          processedQueries
        );
      } catch (error) {
        console.error(`Error listing documents in ${col.name}:`, error);
        throw error;
      }
    },

    get: async (id: string): Promise<DocumentResponse> => {
      try {
        return await databases.getDocument(col.dbId, col.id, id);
      } catch (error) {
        console.error(`Error getting document ${id} from ${col.name}:`, error);
        throw error;
      }
    },
  };
});

export default db;
