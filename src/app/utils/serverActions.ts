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
} from "firebase/firestore";
import { Vault } from "../../components/UserVaults";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export const server_handleUser = async () => {
  const { userId } = auth();
  const db = getFirestore(firebase_app);
  const docRef = doc(db, "users", userId!);

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("User already exists in the database.");
  } else if (userId) {
    await setDoc(docRef, { plan: "free" }, { merge: true });
    console.log("User created and added to db");

    const vaultsCollection = collection(db, "users", userId!, "vaults");
    const prootsDoc = doc(vaultsCollection, "proots");
    await setDoc(prootsDoc, {}, { merge: true });
    console.log("Proots document created under vaults collection for the user");
  } else {
    console.error("Nothing Happened");
  }
};

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
}: {
  vaultStyle: string;
  vaultName: string;
}) => {
  const { userId } = auth();
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
    return filename; // Return the unique filename
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

export const server_uploadHTML = async (html: string, vaultId: string) => {
  const { userId } = auth();
  const storage = getStorage(firebase_app);

  try {
    const filename = `html-${vaultId}`;

    const storageRef = ref(storage, `users/${userId}/text/${filename}`);
    await uploadBytesResumable(
      storageRef,
      new Blob([html], { type: "text/html" })
    );
    console.log("uploaded file");
    const downloadURL = await getDownloadURL(storageRef);
    console.log(downloadURL);
    await server_addTextLinkToVault(vaultId, downloadURL);
    console.log("html text linked to user's db");
    return filename; // Return the unique filename
  } catch (e) {
    console.log(`${e},`, userId);
    return "Image Upload failed";
  }
};
