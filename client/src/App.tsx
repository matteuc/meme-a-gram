import { ConfigProvider } from "antd";
import "antd/dist/antd.css";
import { store } from "./store";
import { Provider } from "react-redux";
import StatusProvider from "./context/status";
import AuthProvider from "./context/auth";
import AppRouter from "./AppRouter";

function AppContent() {
  return (
    <>
      <Provider store={store}>
        <StatusProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </StatusProvider>
      </Provider>
    </>
  );
}

function App() {
  return (
    <>
      <ConfigProvider>
        <AppContent />
      </ConfigProvider>
    </>
  );
}

export default App;
