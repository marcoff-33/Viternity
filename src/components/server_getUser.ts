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
} from "firebase/firestore";

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
    await addDoc(vaultsCollection, {});
    console.log("Vaults document created under user document");
  } else {
    console.error("Nothing Happened");
  }
};
