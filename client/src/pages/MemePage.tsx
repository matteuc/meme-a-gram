import { Avatar, Button, Image, message, Modal } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import Text from "antd/lib/typography/Text";
import { useDispatch, useSelector } from "react-redux";
import ReactTimeAgo from "react-timeago";
import { saveAs } from "file-saver";
import { getMeme } from "../store/meme/selectors";
import { AppThunks, RootState } from "../store";
import { getUser } from "../store/user/selectors";

const memePageStylesheet = {
  section: {
    margin: "10px 0",
  },
  username: {
    marginLeft: "10px",
  },
};

export default function MemePage() {
  const params = useParams<{ memeId: string }>();

  const dispatch = useDispatch();

  const getMemeById = AppThunks.memes.queryMeme(dispatch);

  const thisMemeId = params?.memeId ? parseInt(params.memeId) : -1;

  const meme = useSelector((state: RootState) => getMeme(state, thisMemeId));

  const user = useSelector((state: RootState) =>
    getUser(state, meme?.authorId || -1)
  );

  const [loadingMeme, setLoadingMeme] = React.useState(!Boolean(meme));

  React.useEffect(() => {
    if (meme) return;

    setLoadingMeme(true);

    getMemeById(thisMemeId)
      .catch((e) => {
        console.debug("Error fetching meme by ID", e);
        message.error({content: 'A problem occurred when fetching this meme.', duration: 5})
      })
      .finally(() => {
        setLoadingMeme(false);
      });
  }, [meme, thisMemeId]);

  const navigate = useNavigate();

  const onModalCancel = React.useCallback(() => {
    navigate("/");
  }, [navigate]);

  const username = user?.username || "Anonymous";

  const timestamp = meme ? new Date(meme.createdAt) : null;

  const TimestampText: React.FC = ({ children }) => {
    return <Text type='secondary'>{children}</Text>;
  };

  const downloadImage = () => {
    if (!meme?.imageUrl) return;

    const splitTerms = meme.imageUrl.split(".");

    const fileExtension = splitTerms[splitTerms.length - 1] || "";

    const newFileName = `meme_${(Date.now() / 1000).toFixed(
      0
    )}.${fileExtension}`;

    // UPGRADE - Broken, opening file to download in new tab
    saveAs(meme.imageUrl, newFileName);
  };

  const MainContent = () => {
    if (meme) {
      return (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p>
              <Avatar size='small'>{username[0]}</Avatar>
              <Text strong style={memePageStylesheet.username}>
                {username}
              </Text>
            </p>
          </div>
          <Image
            src={meme.imageUrl}
            wrapperStyle={memePageStylesheet.section}
          />
          <div style={memePageStylesheet.section}>
            <Text>{meme.title || ""}</Text>
          </div>
          <div style={memePageStylesheet.section}>
            {timestamp ? (
              <ReactTimeAgo date={timestamp} component={TimestampText} />
            ) : (
              <></>
            )}
          </div>
          {meme.imageUrl ? (
            <Button
              type='link'
              shape='circle'
              icon={<DownloadOutlined />}
              onClick={downloadImage}
            >
              Download
            </Button>
          ) : (
            <></>
          )}
        </>
      );
    }

    if (loadingMeme) {
      return <p>Loading</p>; // UPGRADE
    }

    return <p>No meme found!</p>; // UPGRADE
  };

  return (
    <Modal visible={true} onCancel={onModalCancel} footer={null}>
      <MainContent />
    </Modal>
  );
}
