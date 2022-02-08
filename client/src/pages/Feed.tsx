import { Col, Row } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import MemeCard from "../components/MemeCard";
import { AppThunks } from "../store";
import { getFeed } from "../store/meme/selectors";

export default function Feed() {
  const navigate = useNavigate();

  const memes = useSelector(getFeed);

  const dispatch = useDispatch();

  const queryFeed = AppThunks.memes.queryFeed(dispatch);

  const [loadingFeed, setLoadingFeed] = React.useState(true);

  const viewMemeById = (id: number) => {
    navigate(`/meme/${id}`);
  };

  const MainContent = () => {
    const noMemesAvailable = !memes.length;
    if (loadingFeed && noMemesAvailable) {
      return <p>Loading memes</p>; // Upgrade
    } else if (!loadingFeed && noMemesAvailable) {
      return <p>No memes available!</p>; // Upgrade
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

  React.useEffect(() => {
    setLoadingFeed(true);

    queryFeed()
      .catch((e) => {
        console.debug("Error fetching feed", { e }); // UPGRADE - show snackbar
      })
      .finally(() => {
        setLoadingFeed(false);
      });
  }, []);

  return (
    <div>
      <MainContent />
      <Outlet />
    </div>
  );
}
