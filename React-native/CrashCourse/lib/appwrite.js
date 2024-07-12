import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projectId: "664d9264001c333602ec",
  databaseId: "664d96bf00037fb48e13",
  userCollectionId: "664d98a900057ef3a486",
  videoCollectionId: "664d9a3b0029061339e0",
  storageId: "664da0020003911f5f68",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;
// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
  try {
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
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const signIn = async (email, password) => {
  try {
    // await account.deleteSession("current");
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
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
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);
    // console.log('====================================');
    // console.log("post ids", posts.documents);
    // console.log('====================================');
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};
export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
      Query.orderDesc("$createdAt"),
    ]);
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw Error("Invalid file type");
    }
    if (!fileUrl) {
      throw Error;
    }
    return fileUrl;
  } catch (error) {
    throw Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;
  const { mimeType, ...rest } = file;
  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };
  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
};

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);
    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );
    return newPost;
  } catch (error) {
    throw new Error(error);
  }
};

export const savePost = async (urls) => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No current account found");

    // Fetch the current user document
    const userDocuments = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (userDocuments.total === 0) {
      throw new Error("No user document found for the current account");
    }

    const userDocumentId = userDocuments.documents[0].$id;

    // Update the user document
    const updatedUser = await databases.updateDocument(
      databaseId,
      userCollectionId,
      userDocumentId,
      { Saved: urls }
    );

    return updatedUser;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const getUserBookmarks = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No current account found");
    // Fetch the user's document
    const userDocuments = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (userDocuments.total === 0) {
      throw new Error("No user document found for the given userId");
    }

    const userDocument = userDocuments.documents[0];
    const saved = userDocument.Saved;
    const videoDocuments = getVideoDocuments(saved);
    return videoDocuments;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

export const getVideoDocuments = async (savedUrls) => {
  try {
    const videoDocuments = [];
    // Loop through each saved URL
    for (const url of savedUrls) {
      // Perform a query to find documents where the 'Saved' field contains the URL
      const query = [Query.equal("video", url)];
      const result = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        query
      );
      // Add the found documents to the array
      videoDocuments.push(...result.documents);
    }
    return videoDocuments;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

// export const download = async (fileId) => {
//   try {
//     // Get the file URL
//     const result = await storage.getFileDownload(storageId, fileId);

//     // Define the local path where the file will be saved
//     const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileId}.ext`; // Adjust the extension as needed

//     // Download the file
//     const downloadResult = await RNFS.downloadFile({
//       fromUrl: result.href,
//       toFile: localFilePath,
//     }).promise;

//     if (downloadResult.statusCode === 200) {
//       console.log('File downloaded successfully:', localFilePath);
//       Alert.alert('Success', 'File downloaded successfully');
//     } else {
//       console.log('File download failed:', downloadResult);
//       Alert.alert('Error', 'File download failed');
//     }
//   } catch (error) {
//     console.error('Error downloading file:', error);
//     Alert.alert('Error', 'Failed to download file. Please try again later.');
//   }
// };
// export const download = async (fileId) => {
//   try {
//     const result = storage.getFileDownload(storageId, fileId);

//     console.log(result);
//     const { uri: localUri } = await FileSystem.downloadAsync(
//       result,
//       FileSystem.documentDirectory + "name.ext"
//     );
//     console.log(localUri);
//   } catch (error) {
//     throw new Error(error);
//   }
// };

export const download = async (fileId) => {
  try {
    const result = await storage.getFileDownload(storageId, fileId);
    const downloadUrl = result.href;
    console.log('Download URL:', downloadUrl);

    const { uri: localUri } = await FileSystem.downloadAsync(
      downloadUrl,
      FileSystem.documentDirectory + 'name.ext'
    );

    console.log('Local file URI:', localUri);
  } catch (error) {
    console.error('Error downloading file:', error);
    throw new Error(error);
  }
};

// export const download = async (fileId) => {
//   try {
//     // Get the file download URL
//     const result = await storage.getFileDownload(storageId, fileId);

//     // Extract the URL from the result
//     const fileUrl = result.href;

//     console.log("Download URL:", fileUrl);

//     // Define the local file path
//     const fileUri = FileSystem.documentDirectory + `${fileId}.ext`;

//     // Ensure the directory exists
//     const directoryUri = FileSystem.documentDirectory;
//     const dirInfo = await FileSystem.getInfoAsync(directoryUri);
//     if (!dirInfo.exists) {
//       await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
//     }

//     // Download the file
//     const { uri: localUri } = await FileSystem.downloadAsync(fileUrl, fileUri);

//     console.log("Downloaded file saved to:", localUri);

//     Alert.alert('Success', 'File downloaded successfully');
//     return localUri;
//   } catch (error) {
//     console.error('Error downloading file:', error);
//     Alert.alert('Error', 'Failed to download file. Please try again later.');
//     throw new Error(error);
//   }
// };

export const getFiles = async () => {
  try {
    const posts = await storage.listFiles(storageId, [Query.equal("mimeType", "video/mp4")])
    console.log('====================================');
    console.log("post ids", posts.files);
    console.log('====================================');
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFileMetadata = async (documentId) => {
  try {
    const result = await databases.getDocument(
      databaseId,
      videoCollectionId,
      documentId
    );
    console.log('Fetched file metadata:', result.video.split('/')[8]);
    return result.video.split('/')[8];
  } catch (error) {
    console.error('Error fetching file metadata:', error);
    throw new Error(error);
  }
};

getFiles()