"use client";

import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getStorage,
} from "firebase/storage";
import firebase_app from "@/firebase/config";
import React, { FormEvent, useState } from "react";

export default function uploadArea() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [imgUrl, setImgUrl] = useState("");

  const storage = getStorage(firebase_app);

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
