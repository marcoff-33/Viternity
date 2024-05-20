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
} from "firebase/firestore";
import { Vault } from "./UserVaults";
import { freemem } from "os";
import firebase from "firebase/compat/app";

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
  const vaults = vaultsSnapshot.docs.map((doc) => doc.data());

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
  const vaultRef = doc(db, "users", "vaults", vaultId);

  const vaultSnap = await getDoc(vaultRef);

  console.log(vaultSnap.data());
};
