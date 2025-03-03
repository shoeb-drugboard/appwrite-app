import axios from 'axios';

// Create an axios instance for Appwrite
const appwriteApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    'X-Appwrite-Key': process.env.NEXT_PUBLIC_APPWRITE_API_KEY,
  },
  withCredentials: true,
});
// Add to your /d:/Drugboard/ecommerce/src/utils/appwrite/api.ts
appwriteApi.interceptors.request.use((config) => {
  config.withCredentials = true;

  // Add any cookies or headers needed
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) {
    // This may not be necessary with withCredentials=true, but adding for completeness
    config.headers[
      'X-Fallback-Cookies'
    ] = `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}=${sessionId}`;
  }

  return config;
});

// Helper function to generate document paths
const docPath = (dbId: string, collId: string, docId?: string) =>
  `/databases/${dbId}/collections/${collId}/documents${
    docId ? `/${docId}` : ''
  }`;

export const appwriteEndpoints = {
  createSession: '/account/sessions/email',
  getAccount: '/account',
  deleteSession: (sessionId: string) => {
    return `/account/sessions/${sessionId}`;
  },

  getDocument: (dbId: string, collId: string, docId: string) =>
    docPath(dbId, collId, docId),

  listDocuments: (dbId: string, collId: string) => docPath(dbId, collId),

  createDocument: (dbId: string, collId: string) => docPath(dbId, collId),

  updateDocument: (dbId: string, collId: string, docId: string) =>
    docPath(dbId, collId, docId),

  deleteDocument: (dbId: string, collId: string, docId: string) =>
    docPath(dbId, collId, docId),
};

export default appwriteApi;
