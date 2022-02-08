import { Button, Form, Input, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Paragraph";
import React from "react";
import { useQuery } from "../utils";

const { TabPane } = Tabs;

export default function LoginPage() {
  const query = useQuery();

  const navigate = useNavigate();

  const defaultView = query.get("view") || "login";

  const onTabKeyChange: React.ComponentProps<typeof Tabs>["onChange"] = (
    tabKey: string
  ) => {
    query.set("view", tabKey);

    const newurl = `${window.location.protocol}//${window.location.host}${
      window.location.pathname.split("?")[0]
    }?${query.toString()}`;

    window.history.pushState({ path: newurl }, "", newurl);
  };

  const closeModal = () => {
    navigate("/");
  };

  return (
    <Modal
      visible={true}
      footer={null}
      style={{
        width: "80vw",
        maxWidth: "700px",
      }}
      onCancel={closeModal}
    >
      <Tabs defaultActiveKey={defaultView} onChange={onTabKeyChange}>
        <TabPane tab='Login' key='login'>
          <div style={{ padding: "20px" }}>
            <Login />
          </div>
        </TabPane>
        <TabPane tab='Signup' key='signup'>
          <div style={{ padding: "20px" }}>
            <Signup />
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
}

function Login() {
  const errorMessage = "Account login failed!"; //TODO

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  return (
    <>
      <Form
        name='basic'
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onFinish}
        autoComplete='off'
      >
        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              validator: async (_, emailEntered) => {
                if (!emailEntered) {
                  return Promise.reject(new Error("Please input your email!"));
                }

                if (!emailEntered.includes("@")) {
                  // UPGRADE
                  return Promise.reject(
                    new Error("Please enter a valid email!")
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            {
              required: true,
              validator: async (_, passEntered) => {
                if (!passEntered) {
                  return Promise.reject(
                    new Error("Please input your password!")
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password />
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
      <Paragraph style={{ margin: "10px 0", textAlign: "end" }}>
        <Text type='danger'>{errorMessage || ""}</Text>
      </Paragraph>
    </>
  );
}

function Signup() {
  const onInfoFinish = (values: any) => {
    // TODO
    console.log("Success Info:", values);
  };

  const onConfirmationFinish = (values: any) => {
    // TODO
    console.log("Success Confirmation:", values);
  };

  const showCodeConfirmation = true; // TODO

  const errorMessage = "Account creation failed!"; //TODO

  function MainContent() {
    const enteredEmail = "test@email.com"; //TODO

    if (showCodeConfirmation) {
      return (
        <>
          <Paragraph style={{ margin: "15px 0" }}>
            Please enter the confirmation code sent to{" "}
            <span style={{ fontWeight: "bold" }}>{enteredEmail}</span>
          </Paragraph>
          <Form
            name='basic'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onConfirmationFinish}
            autoComplete='off'
          >
            <Form.Item
              label='Code'
              name='confirmationCode'
              rules={[
                {
                  required: true,
                  validator: async (_, codeEntered) => {
                    if (!codeEntered) {
                      return Promise.reject(
                        new Error("Please input your confirmation code!")
                      );
                    }

                    if (codeEntered !== "123") {
                      // TODO
                      return Promise.reject(
                        new Error("Please enter a valid confirmation code!")
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input />
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
          <Paragraph style={{ margin: "10px 0", textAlign: "end" }}>
            <Text type='danger'>{errorMessage || ""}</Text>
          </Paragraph>
        </>
      );
    }

    return (
      <Form
        name='basic'
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onInfoFinish}
        autoComplete='off'
      >
        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true,
              validator: async (_, emailEntered) => {
                if (!emailEntered) {
                  return Promise.reject(new Error("Please input your email!"));
                }

                if (!emailEntered.includes("@")) {
                  // UPGRADE
                  return Promise.reject(
                    new Error("Please enter a valid email!")
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Username'
          name='username'
          rules={[
            {
              required: true,
              validator: async (_, nameEntered) => {
                if (!nameEntered) {
                  return Promise.reject(
                    new Error("Please input your username!")
                  );
                }

                // UPGRADE
                if (nameEntered.length < 3) {
                  return Promise.reject(
                    new Error("Please input a valid username!")
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='Password'
          name='password'
          rules={[
            {
              required: true,
              validator: async (_, passEntered) => {
                if (!passEntered) {
                  return Promise.reject(
                    new Error("Please input your password!")
                  );
                }

                if (passEntered.length < 7) {
                  // UPGRADE
                  return Promise.reject(
                    new Error("Please input a valid password!")
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label='Confirm Password'
          name='passwordConfirmation'
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, passConfirmVal) {
                if (getFieldValue("password") === passConfirmVal) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
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
    );
  }

  return <MainContent />;
}
