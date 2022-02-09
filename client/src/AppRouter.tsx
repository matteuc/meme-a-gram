import { Button, PageHeader } from "antd";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import React from "react";
import MemePage from "./pages/MemePage";
import Feed from "./pages/Feed";
import Login from "./pages/LoginPage";
import { APP_TITLE } from "./config";
import CreateMemePage from "./pages/CreateMemePage";
import { useAuthProvider } from "./context/auth";

const navStylesheet = {
  pageHeader: {
    backgroundColor: "#FFDFD3",
  },
};

function AppRouter() {
  const { user } = useAuthProvider();

  const isAuth = Boolean(user);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<Feed />}>
          <Route
            path='login'
            element={isAuth ? <Navigate replace to='/' /> : <Login />}
          />
          <Route
            path='create'
            element={
              !isAuth ? <Navigate replace to='/login' /> : <CreateMemePage />
            }
          />
          <Route path='meme/:memeId' element={<MemePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function NavBar() {
  const { user, logout } = useAuthProvider();

  const username: string | undefined = user?.username;

  const isAuth = Boolean(user);

  const navigate = useNavigate();

  const openLoginModal = React.useCallback(
    () => navigate("/login"),
    [navigate]
  );

  const LoginButton = React.useCallback(
    () => (
      <Button
        data-testid='login-nav-button'
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
