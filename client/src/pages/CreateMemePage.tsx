import { Modal, Image, Button, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function CreateMemePage() {
  const navigate = useNavigate();

  const [currentImageFile, setCurrentImageFile] = React.useState<File>();

  const [imageDataUrl, setImageDataUrl] = React.useState<any>();

  const onModalCancel = () => {
    navigate("/");
  };

  // TODO
  const onSubmit: React.ComponentProps<typeof Form>["onFinish"] = (values) => {
    console.log({ values }, { currentImageFile });
  };

  const getFile = (e: any) => {
    const filesObj = e.target.files || [];

    const currFile = filesObj[0];

    if (currFile) {
      setCurrentImageFile(currFile);

      var reader = new FileReader();

      reader.onload = function (event) {
        setImageDataUrl(event.target?.result);
      };

      reader.readAsDataURL(currFile);
    }
  };

  const errorMessage = "Error creating meme"; // TODO

  const previewImageUrl =
    "https://user-images.githubusercontent.com/101482/29592647-40da86ca-875a-11e7-8bc3-941700b0a323.png";

  return (
    <Modal
      title='Create Meme'
      visible={true}
      footer={null}
      onCancel={onModalCancel}
    >
      <Form
        name='basic'
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onSubmit}
        autoComplete='off'
      >
        <Form.Item
          label='Title'
          name='title'
          rules={[
            {
              required: true,
              validator: async (_, titleEntered) => {
                if (!titleEntered) {
                  return Promise.reject(
                    new Error("Please input your meme title!")
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item rules={[{ required: true }]} name='image' label='Image'>
          <input type={"file"} accept='image/*' onInput={getFile} />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 4, span: 20 }}
          style={{ marginTop: "15px", alignItems: "flex-end" }}
        >
          <Image
            style={{ maxHeight: 200 }}
            preview={Boolean(imageDataUrl)}
            src={imageDataUrl || previewImageUrl}
          />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 20, span: 4 }}
          style={{ marginTop: "15px", alignItems: "flex-end" }}
        >
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Typography.Paragraph style={{ margin: "10px 0", textAlign: "end" }}>
        <Typography.Text type='danger'>{errorMessage || ""}</Typography.Text>
      </Typography.Paragraph>
    </Modal>
  );
}
