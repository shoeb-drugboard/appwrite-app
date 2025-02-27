import { Client, Databases, Query } from "node-appwrite";

export default async ({ req, res, log }) => {
    const client = new Client();
    client.setEndpoint(process.env.APPWRITE_ENDPOINT).setProject(process.env.APPWRITE_PROJECT_ID);
    client.setKey(process.env.APPWRITE_API_KEY);

    const db = new Databases(client);

    if (req.body) {
        log("Event received:", req.body);
        const userData = req.body;
        const profileMatch = await db.listDocuments(process.env.APPWRITE_DB_ID, process.env.APPWRITE_USR_COLLECTION_ID, [
            Query.equal("email", userData.email)
        ]);
        if (profileMatch.documents.length === 0) {
            return res.status(404).send({ message: "User not found." });
        }
        const profileId = profileMatch.documents[0].$id;
        try {
            await db.updateDocument(process.env.APPWRITE_DB_ID, process.env.APPWRITE_USR_COLLECTION_ID, profileId, {
                LoggedIn: true
            });
            res.status(200).send({ message: "User session updated successfully." });
        } catch (error) {
            log.error("Error updating user session:", error);
            res.status(500).send({ message: "Could not update user session." });
        }
    } else {
        res.status(400).send({ message: "Invalid request." });
    }
}