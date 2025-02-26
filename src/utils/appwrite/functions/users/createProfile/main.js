import { Client, Account, Databases, Functions, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
    try {
        // Parse the event data if you create a execution,i.e, createa http trigger, else you can directly access the data from the event
        const eventData = req.body;
        log("Event received:", eventData);

        // Extract user data from event
        const userId = eventData.$id;
        const userName = eventData.name || 'New User';
        const userEmail = eventData.email;

        if (!userId || !userEmail) {
            throw new Error("Missing required user data in event");
        }

        // Initialize Appwrite
        const client = new Client();
        client.setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID);
        client.setKey(process.env.APPWRITE_API_KEY);
        const db = new Databases(client);

        // Create the user profile
        await db.createDocument(
            process.env.APPWRITE_DB_ID,
            process.env.APPWRITE_USR_COLLECTION_ID,
            ID.unique(),
            {
                name: userName,
                email: userEmail,
                LoggedIn: false,
            }
        );

        log("Profile created successfully from event");
        return res.json({ success: true });
    } catch (err) {
        error("Error handling event:", err);
        return res.json({ success: false, error: err.message });
    }
};