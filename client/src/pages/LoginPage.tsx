import { Modal } from "antd";
import { useParams } from "react-router-dom";

export default function Login() {
  const params = useParams<{ view: "login" | "signup" }>();

  return (
    <Modal title='Basic Modal' visible={true}>
      <p>{params.view}</p>
    </Modal>
  );
}
