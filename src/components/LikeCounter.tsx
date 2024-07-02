"use client";

import React from "react";
import { FaHeart } from "react-icons/fa";

export default function LikeCounter({ handleLike }: { handleLike: any }) {
  const [likes, setLikes] = React.useState(50);
  const [isLiked, setIsLiked] = React.useState(false);
  const handleClick = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikes(likes + 1);
    } else {
      setIsLiked(false);
      setLikes(likes - 1);
    }
  };
  return (
    <div
      className="grow min-w-full p-5 flex justify-center "
      onClick={handleClick}
    >
      <FaHeart
        size={35}
        className={`ml-5 transition-colors duration-500 stroke-[10] stroke stroke-primary rounded-full items-start text-start basis-1/12 ${
          isLiked ? "text-primary" : "text-transparent"
        }`}
      />
    </div>
  );
}
