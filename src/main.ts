import { Client, Users, Databases } from 'node-appwrite';


// This Appwrite function will be executed every time your function is triggered
export default async ({req,res}) => {
  const client = new Client();
  client.setEndpoint(process.env.API_ENDPOINT || 'http://localhost/v1').setProject(process.env.PROJECT_ID || '')
  const users = await new Users(client);
  const db = new Databases(client);
  if(req.method === 'GET'){
    const response = await db.listDocuments(process.env.DB_ID || "",process.env.COLLECTION_USERS_ID || '');
    return res.json(response.documents);
}
}
