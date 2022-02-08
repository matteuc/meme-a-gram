import { ConfigProvider } from "antd";
import "antd/dist/antd.css";
import { store } from "./store";
import { Provider } from "react-redux";

function AppContent() {
  return (
    <>
      <Provider store={store}>
        
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
