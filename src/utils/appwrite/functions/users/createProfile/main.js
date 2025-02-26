import { Client, Account, Databases, Functions, ID } from 'node-appwrite';

// export default async ({ req, res, log, error }) => {
//     if (req.body) {
//         const userData = JSON.parse(req.body)
//         log("Request Body", userData)
//         const client = new Client();
//         client.setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID);
//         client.setKey(process.env.APPWRITE_API_KEY);
//         const db = new Databases(client);
//         try {
//             await db.createDocument(
//                 process.env.APPWRITE_DB_ID,
//                 process.env.APPWRITE_USR_COLLECTION_ID,
//                 ID.unique(),
//                 {
//                     name: userData["name"],
//                     email: userData["email"],
//                     LoggedIn: userData["LoggedIn"],
//                 }
//             )
//             log("Profile created successfully")
//         } catch (err) {
//             error("Error creating profile", err)
//             return res.json({
//                 message: "error",
//                 info: err,
//             })
//         }
//         return res.json({
//             message: "success",
//             // info: { userId, userName, userEmail },
//         })
//     } else {
//         return res.json({
//             message: "error",
//             info: "No data found in request body",
//         })
//     }


// }
export default async ({ req, res, log, error }) => {
    try {
        // Parse the event payload
        log("Request Load", req.payload);
        log("Request Body", req.body);
        const eventData = JSON.parse(req.payload);
        log("Event received:", eventData);

        // Extract user data from event
        const userId = eventData.userId;
        const userName = eventData.userName || 'New User';
        const userEmail = eventData.userEmail;

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