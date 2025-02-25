import { Client, Account, Databases } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
    const { userId, userName, userEmail } = JSON.parse(req.payload);
    log(userId, userName, userEmail);
    const client = new Client();
    client.setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID);
    client.setKey(process.env.APPWRITE_API_KEY);

    return res.json({
        message: "success",
        info: { userId, userName, userEmail },
    })

}