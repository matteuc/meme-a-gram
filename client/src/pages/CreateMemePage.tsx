import { Modal, Image, Button, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useDispatch } from "react-redux";
import { AppThunks } from "../store";
import { uploadFileToStorage } from "../services";

export default function CreateMemePage() {
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const [currentImageFile, setCurrentImageFile] = React.useState<File>();

  const [imageDataUrl, setImageDataUrl] = React.useState<any>();

  const [creatingMeme, setCreatingMeme] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState("");

  const dispatch = useDispatch();

  const createMeme = AppThunks.memes.createMeme(dispatch);

  const onModalCancel = () => {
    navigate("/");
  };

  const onSubmit: React.ComponentProps<typeof Form>["onFinish"] = async (
    values: any
  ) => {
    if (!values.title || !currentImageFile) {
      console.debug("Title and image values not found.");

      return;
    }

    setCreatingMeme(true);

    try {
      const fileKey = await uploadFileToStorage(currentImageFile);

      await createMeme({
        imageType: currentImageFile.type,
        imageRef: fileKey,
        title: values.title,
      });
    } catch (e) {
      console.error("Error creating meme:", e);

      setErrorMessage("An error occurred when creating the meme.");
    } finally {
      setCreatingMeme(false);

      onModalCancel();

      form.resetFields(["title", "image"]);

      setCurrentImageFile(undefined);

      setImageDataUrl(undefined);
    }
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
        form={form}
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
          <Input disabled={creatingMeme} />
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
          <Button type='primary' htmlType='submit' loading={creatingMeme}>
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
