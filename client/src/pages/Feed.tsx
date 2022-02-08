import { Col, Row } from "antd";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import MemeCard from "../components/MemeCard";
import { getFeed } from "../store/meme/selectors";

export default function Feed() {
  const navigate = useNavigate();

  const memes = useSelector(getFeed);

  const viewMemeById = (id: number) => {
    navigate(`/meme/${id}`);
  };

  const MainContent = () => {
    if (!memes.length) {
      return <p>No memes available!</p>;
    } else {
      return (
        <Row>
          {memes.map((meme) => (
            <Col span={8}>
              <MemeCard viewMeme={viewMemeById} meme={meme} />
            </Col>
          ))}
        </Row>
      );
    }
  };

  return (
    <div>
      <MainContent />
      <Outlet />
    </div>
  );
}
