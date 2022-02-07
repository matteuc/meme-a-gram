import { ConfigProvider } from "antd";
import "antd/dist/antd.css";

function AppContent() {
  return <></>;
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
