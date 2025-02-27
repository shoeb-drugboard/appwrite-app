import { Client, Databases, Query } from "node-appwrite";

export default async ({ req, res, log }) => {
    const client = new Client();
    client.setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID);
    client.setKey(process.env.APPWRITE_API_KEY);

    const db = new Databases(client);

    if (req.body) {
        log("Event received:", req.body);
        const userData = req.body;

        // Validate providerUid exists in the request
        if (!userData.providerUid) {
            return res.status(400).send({ message: "Email is required." });
        }

        try {
            const profileMatch = await db.listDocuments(process.env.APPWRITE_DB_ID, process.env.APPWRITE_USR_COLLECTION_ID, [
                Query.equal("email", userData.providerUid)
            ]);

            if (profileMatch.documents.length === 0) {
                return res.status(404).send({ message: "User not found." });
            }

            const profileId = profileMatch.documents[0].$id;
            await db.updateDocument(process.env.APPWRITE_DB_ID, process.env.APPWRITE_USR_COLLECTION_ID, profileId, {
                LoggedIn: false
            });

            res.status(200).send({ message: "User logged out successfully." });
        } catch (error) {
            log("Error processing request:", error);
            res.status(500).send({ message: "An error occurred while logging out the user." });
        }
    } else {
        res.status(400).send({ message: "Invalid request." });
    }
}
