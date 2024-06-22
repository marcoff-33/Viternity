import React from "react";

export default function Images({
  cdnUrl,
  isProcessing,
}: {
  cdnUrl: string;
  isProcessing: boolean;
}) {
  const formatImageUrl = (
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
  const dbUrl = formatImageUrl(cdnUrl, "from cdn to storage");
  return (
    <a href={dbUrl} target="_blank" rel="noreferrer">
      <img
        src={`${cdnUrl}&tr=q-10`}
        alt=""
        srcSet={` ${cdnUrl}&tr=w-400 400w, ${cdnUrl}&tr=w-1000 1000w,`}
        sizes="(min-width: 760px) 400px, 1000px"
        className={`${
          isProcessing ? "saturate-0 blur-sm" : "saturate-100 blur-none"
        } object-contain max-h-[85vh] aspect-auto rounded-lg relative transition-all duration-500 w-full`}
      />
    </a>
  );
}
