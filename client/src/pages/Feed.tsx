import { Col, Row } from "antd";
import {
  Outlet,
  useNavigate,
} from "react-router-dom";
import MemeCard from "../components/MemeCard";

export default function Feed() {
  const navigate = useNavigate();

  // TODO - Fetch from store
  const memes: Meme[] = [
    {
      id: 1,
      createdAt: 0,
      imageUrl:
        "https://ichef.bbci.co.uk/news/976/cpsprodpb/F1F2/production/_118283916_b19c5a1f-162b-410b-8169-f58f0d153752.jpg",
    },
    {
      id: 2,
      createdAt: 0,
      imageUrl:
        "https://images.theconversation.com/files/38926/original/5cwx89t4-1389586191.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop",
    },
  ];

  const viewMemeById = (id: number) => {
    navigate(`/meme/${id}`);
  };

  return (
    <div>
      <Row>
        {memes.map((meme) => (
          <Col span={8}>
            <MemeCard viewMeme={viewMemeById} meme={meme} />
          </Col>
        ))}
      </Row>
      <Outlet />
    </div>
  );
}

