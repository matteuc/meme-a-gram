import { Image } from "antd";
import React from "react";

export default function MemeCard({
  viewMeme,
  meme,
  height
}: {
  viewMeme: (id: number) => void;
  meme: Meme;
  height: number
}) {
  const memeId = meme.id;

  const viewThisMeme = React.useCallback(
    () => viewMeme(memeId),
    [memeId, viewMeme]
  );

  const [mouseOver, setMouseOver] = React.useState(false);

  const imageStyle = {
    objectFit: "cover",
    width: "100%",
    transition: ".1s ease",
    opacity: mouseOver ? 0.6 : 1,
    height
  };

  const onHover = React.useCallback(() => setMouseOver(true), []);

  const onHoverOut = React.useCallback(() => setMouseOver(false), []);

  return (
    <Image
      preview={false}
      onClick={viewThisMeme}
      src={meme.imageUrl}
      onMouseOver={onHover}
      onMouseOut={onHoverOut}
      style={imageStyle as any}
    />
  );
}
