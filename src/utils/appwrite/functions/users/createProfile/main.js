import { Client, Account, Databases, Functions, ID } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
    // log(req.body)
    // const data = JSON.parse(req.body)
    // log(data, "Request Body")
    if (req.body) {
        const userData = JSON.parse(req.body)
        log("Request Body", userData)
        log("Request Name", userData["name"])
        // log(userId, userName, userEmail);
        const client = new Client();
        client.setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID);
        client.setKey(process.env.APPWRITE_API_KEY);
        const db = new Databases(client);
        try {
            log(userData["name"], userData["email"], userData["LoggedIn"])
            await db.createDocument(
                process.env.APPWRITE_DB_ID,
                process.env.APPWRITE_USR_COLLECTION_ID,
                ID.unique(),
                {
                    name: userData["name"],
                    email: userData["email"],
                    LoggedIn: userData["LoggedIn"],
                }
            )
            log("Profile created successfully")
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