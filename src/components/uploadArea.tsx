"use client";

import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import firebase_app from "@/firebase/config";
import React, { FormEvent, useEffect, useState } from "react";

import { getFirestore, doc, setDoc } from "firebase/firestore";

import { auth } from "@clerk/nextjs/server";
import { server_handleUser } from "./server_getUser";

export default function uploadArea() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    server_handleUser();
  }, []);

  const storage = getStorage(firebase_app);
  const db = getFirestore(firebase_app);

  const handleSubmit = (e: any | FormEvent) => {
    e.preventDefault();

    const file = e.target[0]?.files[0];
    const storageRef = ref(storage, `files/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
        });
      }
    );
  };

  return (
    <div>
      <button className="bg-red-500" onClick={() => server_handleUser()}>
        create user
      </button>
      <form onSubmit={handleSubmit}>
        <input type="file" name="" id="" />
        <button type="submit">Upload</button>
      </form>
      {!imgUrl && (
        <div className="outerbar">
          <div className="innerbar" style={{ width: `${progresspercent}%` }}>
            {progresspercent}%
          </div>
        </div>
      )}
      {imgUrl && <img src={imgUrl} alt="uploaded file" height={200} />}
    </div>
  );
}
