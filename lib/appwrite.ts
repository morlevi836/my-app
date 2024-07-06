import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "6685743600075750f992",
  databaseId: "6685764c001341a76740",
  userCollectionId: "6685768f0025bb8ceb3c",
  videoCollectionId: "668576d100344dc0d2a3",
  storageId: "6685802d00335385cb56",
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (
  email?: string,
  password?: string,
  username?: string
) => {
  console.log("creating....");

  try {
    if (email && password && username) {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
      if (!newAccount) throw Error;

      const avatarUrl = avatars.getInitials(username);

      await signIn(email, password);

      const newUser = await databases.createDocument(
        config.databaseId,
        config.userCollectionId,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email,
          username,
          avatar: avatarUrl,
        }
      );

      return newUser;
    }
  } catch (error: any) {
    console.error(error);
    throw new Error();
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    if (
      error.message.includes(
        "Creation of a session is prohibited when a session is active"
      )
    ) {
      await account.deleteSessions();
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } else {
      console.error(error);
      throw new Error(error.message);
    }
  }
};

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error: any) {
    throw new Error(error);
  }
}

// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}
