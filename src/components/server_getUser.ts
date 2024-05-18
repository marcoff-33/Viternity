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
} from "firebase/firestore";
import { Vault } from "./UserVaults";
import { freemem } from "os";

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
  const vaultsCollection = collection(db, "users", userId!, "vaults");

  const vaultsSnapshot = await getDocs(vaultsCollection);
  const vaults = vaultsSnapshot.docs.map((doc) => doc.data());

  return vaults as Vault[];
};

export const server_createVault = async ({
  vaultName,
  vaultStyle,
}: {
  vaultName: string;
  vaultStyle: string;
}) => {
  const { userId } = auth();
  try {
    const db = getFirestore(firebase_app);
    const userVaults = collection(db, "users", userId!, "vaults");

    const newVault = doc(userVaults, vaultName);
    await setDoc(
      newVault,
      { name: vaultName, plan: "free", style: vaultStyle },
      { merge: true }
    );
  } catch (error) {
    console.log("Error Creating Vault");
  }
};
