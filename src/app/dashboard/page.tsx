import PicturesArea from "@/components/picturesArea";
import UploadArea from "@/components/uploadArea";
import { UserButton } from "@clerk/nextjs";

import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import React, { useState } from "react";

export default function page() {
  return (
    <div>
      <UserButton />
      <UploadArea />
      <PicturesArea />
    </div>
  );
}
