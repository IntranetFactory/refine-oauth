import { ThemedTitleV2 } from "@refinedev/antd";
import { Button, Layout, Space, Typography } from "antd";

import { useAuth } from "react-oidc-context";

import { AppIcon } from "../components/app-icon";

export const Login: React.FC = () => {
  const { signinRedirect } = useAuth();

  return (
    <Layout
      style={{
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Space direction="vertical" align="center">
        <ThemedTitleV2
          collapsed={false}
          wrapperStyles={{
            fontSize: "22px",
            marginBottom: "36px",
          }}
          text="Refine Project"
          icon={<AppIcon />}
        />
        <Button
          style={{ width: "240px", marginBottom: "32px" }}
          type="primary"
          size="middle"
          onClick={() => signinRedirect()}
        >
          Sign in
        </Button>
        <Typography.Text type="secondary">
          Powered by
          <img
            style={{ padding: "0 5px" }}
            alt="Auth0"
            src="https://refine.ams3.cdn.digitaloceanspaces.com/superplate-auth-icons%2Fauth0-2.svg"
          />
          Auth0
        </Typography.Text>
      </Space>
    </Layout>
  );
};
