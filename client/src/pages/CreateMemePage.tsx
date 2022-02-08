import { Modal } from "antd";
import { useNavigate } from "react-router-dom";

export default function CreateMemePage() {
  const navigate = useNavigate();

  const onModalCancel = () => {
    navigate("/");
  };

  return (
    <Modal
      title='Create Meme'
      visible={true}
      footer={null}
      onCancel={onModalCancel}
    >
      Create Meme
    </Modal>
  );
}
