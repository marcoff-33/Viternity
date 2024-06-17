"use server";
import firebase_app from "@/firebase/config";
import { auth } from "@clerk/nextjs/server";
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
import { Vault } from "../../components/UserVaults";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { url } from "inspector";
import { revalidatePath } from "next/cache";

export const server_handleUser = async () => {
  const { userId } = auth();
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
  const { userId } = auth();
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
  userPassword,
  adminPassword,
}: {
  vaultStyle: string;
  vaultName: string;
  isPrivate: boolean;
  userPassword: string;
  adminPassword: string;
}) => {
  const { userId } = auth();
  const db = getFirestore(firebase_app);
  await server_handleUser();
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
        userPassword,
        adminPassword,
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

  return vaultSnap.data() as Vault;
};

export const server_uploadFile = async (
  formData: FormData,
  vaultId: string
) => {
  const { userId } = auth();
  const storage = getStorage(firebase_app);

  try {
    const file = formData.get("file") as File;

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
    return "Image Upload failed";
  }
};

const server_addLinkToVault = async (vaultId: string, downloadURL: string) => {
  const db = getFirestore(firebase_app);
  const vaultRef = doc(db, "vaults", vaultId);
  await updateDoc(vaultRef, {
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
  const { userId } = auth();
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
    return "Image Upload failed";
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
    const { userId } = auth();
    const userRef = doc(db, "users", userId!);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    const ownedVaults = userData?.ownedVaults;
    await updateDoc(userRef, { ownedVaults: ownedVaults - 1 });
  } catch (error) {
    return `Error deleting vault: ${error}`;
  }
};

export const server_deleteFile = async (fileUrl: string, vaultId: string) => {
  try {
    const storage = getStorage(firebase_app);
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
    await server_removeLinkToVault(vaultId, fileUrl);
  } catch (error) {
    console.log(error);
  }
};

const server_removeLinkToVault = async (
  vaultId: string,
  downloadURL: string
) => {
  const db = getFirestore(firebase_app);
  const vaultRef = doc(db, "vaults", vaultId);
  await updateDoc(vaultRef, {
    imageUrls: arrayRemove(downloadURL),
  });
};
