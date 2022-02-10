import { Button, Col, Empty, message, Row, Space, Spin, Tooltip } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { PlusOutlined, SyncOutlined, MehOutlined } from "@ant-design/icons";

import MemeCard from "../components/MemeCard";
import { AppThunks } from "../store";
import { getFeed } from "../store/meme/selectors";

const MemoMemeCard = React.memo(MemeCard);

const fabSize = "50px";

const stylesheet = {
  pageContentSpace: {
    height: "60vh",
    maxHeight: "1000px",
    display: "flex",
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: 60,
    color: "grey",
  },
  syncIcon: { fontSize: 60, color: "#1890ff" },
  emptyComp: { alignSelf: "center" },
  fab: {
    position: "fixed",
    bottom: 30,
    right: 50,
    width: fabSize,
    height: fabSize,
  },
};

export default function Feed() {
  const navigate = useNavigate();

  const memes = useSelector(getFeed);

  const dispatch = useDispatch();

  const queryFeed = AppThunks.memes.queryFeed(dispatch);

  const [loadingFeed, setLoadingFeed] = React.useState(true);

  const viewMemeById = (id: number) => {
    navigate(`/meme/${id}`);
  };

  const openCreateModal = () => {
    navigate("/create");
  };

  const sortedMemes = React.useMemo(
    () => memes.sort((a, b) => b.createdAt - a.createdAt),
    [memes]
  );

  const MainContent = () => {
    const imageRowHeight = 250;

    const noMemesAvailable = !sortedMemes.length;

    if (loadingFeed && !noMemesAvailable) {
      return (
        <div style={stylesheet.pageContentSpace}>
          <Space size='middle'>
            <SyncOutlined style={stylesheet.syncIcon} spin />
          </Space>
        </div>
      );
    } else if (!loadingFeed && noMemesAvailable) {
      return (
        <div style={stylesheet.pageContentSpace}>
          <Empty
            style={stylesheet.emptyComp}
            image={
              <>
                <MehOutlined style={stylesheet.emptyIcon} />
              </>
            }
            imageStyle={{
              height: 150,
            }}
            description={<span>No memes yet!</span>}
          >
            <Button type='primary' onClick={openCreateModal}>
              Create Now
            </Button>
          </Empty>
        </div>
      );
    } else {
      return (
        <Row>
          {sortedMemes.map((meme) => (
            <Col xs={12} sm={8} lg={6}>
              <MemoMemeCard
                viewMeme={viewMemeById}
                meme={meme}
                height={imageRowHeight}
              />
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
        console.debug("Error fetching feed", { e });
        message.error({
          content:
            "A problem occurred when fetching the feed. Please try again later!",
          duration: 5,
        });
      })
      .finally(() => {
        setLoadingFeed(false);
      });
  }, []);

  const OpenCreateMemeModalButton = () => {
    const navigate = useNavigate();

    const openModal = () => {
      navigate("/create");
    };

    return (
      <Tooltip title='Create Meme'>
        <Button
          data-testid='create-meme-fab'
          style={stylesheet.fab as any}
          size='large'
          type='primary'
          shape='circle'
          onClick={openModal}
          icon={<PlusOutlined />}
        />
      </Tooltip>
    );
  };

  return (
    <div data-testid='feed-content'>
      <MainContent />
      <OpenCreateMemeModalButton />
      <Outlet />
    </div>
  );
}
