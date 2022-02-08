import { Button, PageHeader } from "antd";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import React from "react";
import MemePage from "./pages/MemePage";
import Feed from "./pages/Feed";
import Login from "./pages/LoginPage";
import { APP_TITLE } from "./config";

const navStylesheet = {
  pageHeader: {
    backgroundColor: "#FFDFD3",
  },
};

function AppRouter() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<Feed />}>
          <Route path='meme/:memeId' element={<MemePage />} />
          <Route path='login' element={<Login />} />
          {/* TODO - Add create meme screen */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function NavBar() {
  const username: string | undefined = "mattiuc"; // TODO

  const isAuth = false; // TODO

  const navigate = useNavigate();

  const openLoginModal = React.useCallback(
    () => navigate("/login"),
    [navigate]
  );

  const logout = React.useCallback(() => {
    // TODO - logout
  }, []);

  const LoginButton = React.useCallback(
    () => (
      <Button
        size='large'
        type='text'
        shape='circle'
        icon={<LoginOutlined />}
        onClick={openLoginModal}
      />
    ),
    [openLoginModal]
  );

  const LogoutButton = React.useCallback(
    () => (
      <Button
        size='large'
        type='text'
        shape='circle'
        icon={<LogoutOutlined />}
        onClick={logout}
      />
    ),
    [logout]
  );

  return (
    <PageHeader
      style={navStylesheet.pageHeader}
      title={APP_TITLE}
      subTitle={username}
      extra={[isAuth ? <LogoutButton /> : <LoginButton />]}
    />
  );
}

export default AppRouter;
