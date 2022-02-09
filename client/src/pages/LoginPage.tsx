import { Button, Form, Input, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Paragraph";
import React from "react";
import { useQuery } from "../utils";
import { useAuthProvider } from "../context/auth";
import {
  EMAIL_REQ_REGEX,
  MIN_USERNAME_LENGTH,
  PASSWORD_REQ_REGEX,
} from "../config";

const { TabPane } = Tabs;

const stylesheet = {
  mainModalContent: { width: "80vw", maxWidth: "700px" },
  tabContent: { padding: "20px" },
  submitIcon: { marginTop: "15px", alignItems: "flex-end" },
  errorMessage: { margin: "10px 0", textAlign: "end" },
  infoMessage: { margin: "15px 0" },
  boldedMessage: { fontWeight: "bold" },
};

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
      style={stylesheet.mainModalContent}
      onCancel={closeModal}
    >
      <Tabs defaultActiveKey={defaultView} onChange={onTabKeyChange}>
        <TabPane tab='Login' key='login'>
          <div style={stylesheet.tabContent}>
            <Login />
          </div>
        </TabPane>
        <TabPane tab='Signup' key='signup'>
          <div style={stylesheet.tabContent}>
            <Signup />
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
}

function Login() {
  const { login } = useAuthProvider();

  const [form] = Form.useForm();

  const [loggingIn, setLoggingIn] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState("");

  const onFinish = async (values: any) => {
    if (!values.email || !values.password) {
      console.debug("Email and password values not found.");
      return;
    }

    setLoggingIn(true);

    try {
      await login(values.email, values.password);

      setErrorMessage("");
    } catch (e) {
      console.error("Error logging in:", e);

      setErrorMessage("Account login failed!");

      form.resetFields(["password"]);
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <>
      <Form
        form={form}
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

                if (!EMAIL_REQ_REGEX.test(emailEntered)) {
                  return Promise.reject(
                    new Error("Please enter a valid email!")
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input disabled={loggingIn} />
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
          <Input.Password disabled={loggingIn} />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 20, span: 4 }}
          style={stylesheet.submitIcon}
        >
          <Button type='primary' htmlType='submit' loading={loggingIn}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Paragraph style={stylesheet.errorMessage as any}>
        <Text type='danger'>{errorMessage || ""}</Text>
      </Paragraph>
    </>
  );
}

function Signup() {
  const [infoForm] = Form.useForm<{
    email: string;
    password: string;
    passwordConfirmation: string;
    username: string;
  }>();

  const [codeForm] = Form.useForm<{
    confirmationCode: string;
  }>();

  const [confirmRegistrationHandler, setConfirmRegistrationHandler] =
    React.useState<(code: string, name: string) => Promise<void>>();

  const [errorMessage, setErrorMessage] = React.useState("");

  const { signUp } = useAuthProvider();

  const [actionsLoading, setActionsLoading] = React.useState({
    signup: false,
    codeConfirmation: false,
  });

  const onInfoFinish = async (values: any) => {
    if (!values.email || !values.password) {
      console.debug("Email and password values not found.");
      return;
    }

    setActionsLoading((oldLoading) => ({
      ...oldLoading,
      signup: true,
    }));

    try {
      const confirmRegistration = await signUp(values.email, values.password);

      setConfirmRegistrationHandler(() => confirmRegistration);

      setErrorMessage("");
    } catch (e) {
      console.error("Error when signing up:", e);

      setErrorMessage("An error occurred when signing up.");
    } finally {
      setActionsLoading((oldLoading) => ({
        ...oldLoading,
        signup: false,
      }));
    }
  };

  const onConfirmationFinish = async (values: any) => {
    if (!values.confirmationCode) {
      console.debug("Confirmation code value not found.");
      return;
    }

    if (!confirmRegistrationHandler) {
      console.debug("Confirmation registration handler not available.");
      return;
    }

    const userName = infoForm.getFieldValue("username");

    if (!userName) {
      console.debug("Username value not found.");
      return;
    }

    setActionsLoading((oldLoading) => ({
      ...oldLoading,
      codeConfirmation: true,
    }));

    try {
      await confirmRegistrationHandler(values.confirmationCode, userName);

      setConfirmRegistrationHandler(undefined);

      setErrorMessage("");
    } catch (e) {
      console.error("Error when confirming registration:", e);

      setErrorMessage("An error occurred when confirming the registration.");
    } finally {
      setActionsLoading((oldLoading) => ({
        ...oldLoading,
        codeConfirmation: false,
      }));
    }
  };

  const showCodeConfirmation = Boolean(confirmRegistrationHandler);

  function MainContent() {
    if (showCodeConfirmation) {
      return (
        <>
          <Paragraph style={stylesheet.infoMessage}>
            Please enter the confirmation code sent to{" "}
            <span style={stylesheet.boldedMessage}>
              {infoForm.getFieldValue("email")}
            </span>
          </Paragraph>
          <Form
            form={codeForm}
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

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input disabled={actionsLoading.codeConfirmation} />
            </Form.Item>
            <Form.Item
              wrapperCol={{ offset: 20, span: 4 }}
              style={stylesheet.submitIcon}
            >
              <Button
                type='primary'
                htmlType='submit'
                loading={actionsLoading.codeConfirmation}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Paragraph style={stylesheet.errorMessage as any}>
            <Text type='danger'>{errorMessage || ""}</Text>
          </Paragraph>
        </>
      );
    }

    return (
      <Form
        form={infoForm}
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

                if (!EMAIL_REQ_REGEX.test(emailEntered)) {
                  return Promise.reject(
                    new Error("Please enter a valid email!")
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input disabled={actionsLoading.signup} />
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

                if (nameEntered.length < MIN_USERNAME_LENGTH) {
                  return Promise.reject(
                    new Error(
                      `Please input a valid username at least ${MIN_USERNAME_LENGTH} characters long!`
                    )
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input disabled={actionsLoading.signup} />
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

                if (!PASSWORD_REQ_REGEX.test(passEntered)) {
                  return Promise.reject(
                    new Error("Please input a valid password!")
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password disabled={actionsLoading.signup} />
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
          <Input.Password disabled={actionsLoading.codeConfirmation} />
        </Form.Item>

        <Form.Item
          wrapperCol={{ offset: 20, span: 4 }}
          style={stylesheet.submitIcon}
        >
          <Button
            type='primary'
            htmlType='submit'
            loading={actionsLoading.signup}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }

  return <MainContent />;
}
