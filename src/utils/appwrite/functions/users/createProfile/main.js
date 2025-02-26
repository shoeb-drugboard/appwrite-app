import { Client, Account, Databases, Functions } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
    log(req.body, "Request Body")
    // log(userId, userName, userEmail);
    const client = new Client();
    client.setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID);
    client.setKey(process.env.APPWRITE_API_KEY);
    const db = new Databases(client);
    // const profile = new Functions(client);

    try {
        await db.createDocument(
            process.env.APPWRITE_DB_ID,
            process.env.APPWRITE_USR_COLLECTION_ID,
            userId,
            {
                userId,
                name: userName,
                email: userEmail,
                LoggedIn: false,
                createdAt: Date.now(),
                updatedAt: Date.now()

            }
        )
        log("Profile created successfully", userId)
    } catch (err) {
        error("Error creating profile", err)
        return res.json({
            message: "error",
            info: err,
        })
    }
    return res.json({
        message: "success",
        // info: { userId, userName, userEmail },
    })

}