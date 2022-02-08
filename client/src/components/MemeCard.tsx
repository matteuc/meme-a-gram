import { Image } from "antd";
import React from "react";

export default function MemeCard({
    viewMeme,
    meme,
  }: {
    viewMeme: (id: number) => void;
    meme: Meme;
  }) {
    const memeId = meme.id;
  
    const viewThisMeme = React.useCallback(
      () => viewMeme(memeId),
      [memeId, viewMeme]
    );
  
    return <Image preview={false} onClick={viewThisMeme} src={meme.imageUrl} />;
  }