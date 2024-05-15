"use client";

import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import React, { useState } from "react";

function UserPage() {
  const [userImages, setUserImages] = useState([""]);

  const storage = getStorage();
  const storageRef = ref(storage, `files/`);

  const fetchUserImages = async () => {
    try {
      const result = await listAll(storageRef);
      const imageUrls = result.items.map((itemRef) => getDownloadURL(itemRef));
      setUserImages(await Promise.all(imageUrls));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <div>
      <button onClick={fetchUserImages}>fetch</button>
      <h1>User Images</h1>
      {userImages.length > 0 && userImages[0].length > 1 ? (
        <ul>
          {userImages.map((imageUrl) => (
            <li key={imageUrl}>
              <img src={imageUrl} alt="User Image" />
            </li>
          ))}
        </ul>
      ) : (
        <p>No images found.</p>
      )}
    </div>
  );
}

export default UserPage;
