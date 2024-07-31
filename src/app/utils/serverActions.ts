"use server";
import firebase_app from "@/firebase/config";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  FieldValue,
  arrayUnion,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { Vault, vaultTemplate } from "../../components/UserVaults";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { url } from "inspector";
import { revalidatePath } from "next/cache";
import { auth } from "./auth";
import VaultTemplate from "@/components/VaultTemplate";

export const server_handleNewUser = async (userId: string) => {
  const db = getFirestore(firebase_app);
  const docRef = doc(db, "users", userId!);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("User already exists in the database.");
  } else if (userId) {
    await setDoc(docRef, { plan: "free", ownedVaults: 0 }, { merge: true });
    console.log("User created and added to db");
  } else {
    console.error("Nothing Happened");
  }
};
// todo: refactor create user logic
export const server_getUserVaults = async () => {
  const session = await auth();
  const userId = session?.user.userId;

  const db = getFirestore(firebase_app);
  const vaultsCollection = collection(db, "vaults");
  const queryVaults = query(vaultsCollection, where("authorId", "==", userId));

  const vaultsSnapshot = await getDocs(queryVaults);
  const vaults = vaultsSnapshot.docs.map((doc) => {
    const data = doc.data();
    const id = doc.id;
    return { ...data, id };
  });

  console.log(vaults);
  return vaults as Vault[];
};

export const server_createVault = async ({
  vaultStyle,
  vaultName,
  isPrivate,
  vaultPassword,
}: {
  vaultStyle: string;
  vaultName: string;
  isPrivate: boolean;
  vaultPassword: string;
}) => {
  const session = await auth();
  const userId = session?.user.userId;
  const db = getFirestore(firebase_app);

  const userRef = doc(db, "users", userId!);

  const userSnap = await getDoc(userRef);

  const userData = userSnap.data();
  const ownedVaults = userData?.ownedVaults;
  const userPlan = userData?.plan;

  if (
    (userPlan === "free" && ownedVaults >= 1) ||
    (userPlan === "paid" && ownedVaults >= 3)
  ) {
    throw new Error(
      "You have already created the maximum number of Vaults for your Plan."
    );
  }

  try {
    const vaultsRef = collection(db, "vaults");

    const newVaultRef = doc(vaultsRef);
    await setDoc(
      newVaultRef,
      {
        name: vaultName,
        plan: "free",
        style: vaultStyle,
        authorId: userId,
        imageUrls: [],
        vaultText: "",
        isPrivate,
        vaultPassword,
        vaultTitle: "",
        vaultTemplate: "Default",
        imageDescriptions: [],
      },
      { merge: true }
    );

    await updateDoc(userRef, { ownedVaults: ownedVaults + 1 });

    const vaultId = newVaultRef.id;
    console.log("Vault created with ID:", vaultId);

    return vaultId;
  } catch (error) {
    console.error("Error creating vault:", error);
    throw error;
  }
};

export const server_getVaultData = async (vaultId: string) => {
  const db = getFirestore(firebase_app);
  const vaultRef = doc(db, "vaults", vaultId);

  const vaultSnap = await getDoc(vaultRef);
  const data = vaultSnap.data() as Vault;

  const imageUrls = await Promise.all(
    data.imageUrls.map(async (url) => {
      const formattedUrl = await server_formatImageUrl(
        url,
        "from storage to cdn"
      );
      return formattedUrl;
    })
  );

  data.imageUrls = imageUrls;

  return data;
};

export const server_uploadFile = async (
  formData: FormData,
  vaultId: string
) => {
  const session = await auth();
  const userId = session?.user.userId;
  const storage = getStorage(firebase_app);

  try {
    const file = formData.get("file") as File;

    if (!file.type.startsWith("image/")) {
      throw new Error("Invalid file type. Please upload an image file.");
    }

    if (file.size > 1024 * 1024 * 10) {
      throw new Error("File size exceeds 10MB limit.");
    }

    // unique file name to avoid overwrites in db, temporary until better solution
    const timestamp = Date.now();
    const filename = `${file.name}-${timestamp}`;

    const storageRef = ref(storage, `users/${userId}/files/${filename}`);
    await uploadBytesResumable(storageRef, file);
    console.log("uploaded file");
    const downloadURL = await getDownloadURL(storageRef);
    console.log(downloadURL);
    await server_addLinkToVault(vaultId, downloadURL);
    console.log("image linked to user's db");
    return downloadURL; // Return the unique filename
  } catch (e) {
    console.log(`${e},`, userId);
    throw e;
  }
};

const server_addLinkToVault = async (vaultId: string, downloadURL: string) => {
  const db = getFirestore(firebase_app);
  const vaultRef = doc(db, "vaults", vaultId);
  const imageId = new Date();

  await updateDoc(vaultRef, {
    imageDescriptions: arrayUnion(
      "added " + imageId + " (click to edit description)"
    ),
    imageUrls: arrayUnion(downloadURL),
  });
};

const server_addTextLinkToVault = async (
  vaultId: string,
  downloadURL: string
) => {
  const db = getFirestore(firebase_app);
  const vaultRef = doc(db, "vaults", vaultId);
  await updateDoc(vaultRef, {
    vaultText: downloadURL,
  });
};

export const server_addDescriptionToImage = async (
  vaultId: string,
  text: string,
  index: number
) => {
  const db = getFirestore(firebase_app);
  const vaultRef = doc(db, "vaults", vaultId);
  // pretty sure you can't update an array at a given index in firestore, so we mutate the entire thing and update it
  const docSnap = await getDoc(vaultRef);

  if (docSnap.exists()) {
    const imageDescriptions = docSnap.data().imageDescriptions;
    console.log(imageDescriptions);
    imageDescriptions[index] = text;
    await updateDoc(vaultRef, {
      imageDescriptions: imageDescriptions,
    });
  } else {
    console.log("Failed to update image description");
  }
};

export const server_checkIfVaultExists = async (vaultId: string) => {
  const db = getFirestore(firebase_app);
  const vaultRef = doc(db, "vaults", vaultId);
  try {
    const vaultSnapshot = await getDoc(vaultRef);
    return vaultSnapshot.exists();
  } catch (error) {
    return false;
  }
};

export const server_uploadHTML = async (text: string, vaultId: string) => {
  const session = await auth();
  const userId = session?.user.userId;
  const storage = getStorage(firebase_app);

  try {
    const filename = `text-${vaultId}`;

    const storageRef = ref(storage, `users/${userId}/text/${filename}`);
    await uploadBytesResumable(storageRef, new Blob([text], { type: "text" }));
    console.log("uploaded file");
    const downloadURL = await getDownloadURL(storageRef);
    console.log(downloadURL);
    await server_addTextLinkToVault(vaultId, downloadURL);
    console.log("text linked to user's db");
    return filename; // Return the unique filename
  } catch (e) {
    console.log(`${e},`, userId);
    return e;
  }
};

export const server_getVaultTextContent = async (textFileUrl: string) => {
  try {
    const textPage = await fetch(textFileUrl);
    const text = await textPage.text();
    return text;
  } catch (error) {
    console.log(error);
  }
};

export const server_deleteVault = async (vaultId: string) => {
  try {
    const db = getFirestore(firebase_app);
    const vaultRef = doc(db, "vaults", vaultId);
    await deleteDoc(vaultRef);
    revalidatePath("/dashboard");
    const session = await auth();
    const userId = session?.user.userId;
    const userRef = doc(db, "users", userId!);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const ownedVaults = userData?.ownedVaults;
    await updateDoc(userRef, { ownedVaults: ownedVaults - 1 });
  } catch (error) {
    return `Error deleting vault: ${error}`;
  }
};

export const server_deleteFile = async (
  fileUrl: string,
  vaultId: string,
  index: number
) => {
  try {
    const storage = getStorage(firebase_app);
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
    await server_removeLinkToVault(vaultId, fileUrl, index);
  } catch (error) {
    console.log(error);
  }
};

const server_removeLinkToVault = async (
  vaultId: string,
  downloadURL: string,
  index: number
) => {
  const db = getFirestore(firebase_app);
  const vaultRef = doc(db, "vaults", vaultId);

  const vaultSnap = await getDoc(vaultRef);

  if (vaultSnap.exists()) {
    const imageDescriptions = vaultSnap.data().imageDescriptions;

    imageDescriptions.splice(index, 1);

    await updateDoc(vaultRef, {
      imageUrls: arrayRemove(downloadURL),
      imageDescriptions: imageDescriptions,
    });
  }
};

export const server_formatImageUrl = async (
  downloadURL: string,
  from: "from storage to cdn" | "from cdn to storage"
) => {
  const fromBaseUrl =
    from === "from storage to cdn"
      ? "https://firebasestorage.googleapis.com"
      : "https://ik.imagekit.io/viternity";
  const toBaseUrl =
    from === "from storage to cdn"
      ? "https://ik.imagekit.io/viternity"
      : "https://firebasestorage.googleapis.com";

  const formattedUrl = downloadURL.replace(fromBaseUrl, toBaseUrl);
  return formattedUrl;
};

export const server_updateVaultTitle = async (
  vaultId: string,
  newTitle: string
) => {
  const db = getFirestore(firebase_app);
  const vaultRef = doc(db, "vaults", vaultId);
  await updateDoc(vaultRef, {
    vaultTitle: newTitle,
  });
};

export const server_updateVaultTemplate = async (
  vaultId: string,
  newTemplate: vaultTemplate
) => {
  const db = getFirestore(firebase_app);
  const vaultRef = doc(db, "vaults", vaultId);
  await updateDoc(vaultRef, {
    vaultTemplate: newTemplate,
  });
};
