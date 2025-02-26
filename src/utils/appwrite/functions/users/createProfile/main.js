import { Client, Account, Databases, Functions, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
    // log(req.body)
    // const data = JSON.parse(req.body)
    // log(data, "Request Body")
    if (req.body) {
        log("Request Body", req.body)
        const { email, name, LoggedIn } = req.body;
        // log(userId, userName, userEmail);
        const client = new Client();
        client.setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID);
        client.setKey(process.env.APPWRITE_API_KEY);
        const db = new Databases(client);
        // if (req.method === "POST") {
        //     log("POST request")
        // } else {
        //     log("Not a POST request")
        // }
        try {
            await db.createDocument(
                process.env.APPWRITE_DB_ID,
                process.env.APPWRITE_USR_COLLECTION_ID,
                ID.unique(),
                {
                    name: name,
                    email: email,
                    LoggedIn: LoggedIn,
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
    } else {
        return res.json({
            message: "error",
            info: "No data found in request body",
        })
    }


}