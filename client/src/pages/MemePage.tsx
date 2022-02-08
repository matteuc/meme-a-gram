import { Avatar, Button, Card, Col, Image, Modal, PageHeader, Row } from "antd";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  Link,
  Outlet,
  useNavigate,
} from "react-router-dom";
import React from "react";
import Text from "antd/lib/typography/Text";

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

  const thisMemeId = params?.memeId;

  console.log("FETCH", thisMemeId);

  const meme: Meme = {
    id: 1,
    title: "Meme Title",
    createdAt: 0,
    imageUrl:
      "https://ichef.bbci.co.uk/news/976/cpsprodpb/F1F2/production/_118283916_b19c5a1f-162b-410b-8169-f58f0d153752.jpg",
  };

  const user: User = {
    username: "matteuc",
    id: 1,
  };

  const navigate = useNavigate();

  const onCancel = React.useCallback(() => {
    navigate("/");
  }, [navigate]);

  const username = user.username || "Anon";

  const timestampText = "Dec 10";

  return (
    <Modal visible={true} onCancel={onCancel} footer={null}>
      <p>
        <Avatar size='small'>{username[0]}</Avatar>
        <Text strong style={memePageStylesheet.username}>
          {username}
        </Text>
      </p>
      <Image src={meme.imageUrl} wrapperStyle={memePageStylesheet.section} />
      <div style={memePageStylesheet.section}>
        <Text>{meme.title || ""}</Text>
      </div>
      <div style={memePageStylesheet.section}>
        <Text type='secondary'>{timestampText}</Text>
      </div>
    </Modal>
  );
}
