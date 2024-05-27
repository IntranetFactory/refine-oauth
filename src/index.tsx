import { AuthProvider } from "react-oidc-context";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

const host = "https://app.adenin.com"
// const host = "https://localhost:44367";

const oidcConfig = {
  authority: `${host}`,
  client_id: "8uog5nrra8tpkyp9czq1pg7sq2w1klvv",
  redirect_uri: window.location.origin,
  loadUserInfo: true,
  metadata: {
    authorization_endpoint: `${host}/oauth2/authorize`,    
    token_endpoint: `${host}/oauth2/token`,
    userinfo_endpoint:  `${host}/api/userinfo`, // "https://app.adenin.com/api/session/myprofile",
    //revocation_endpoint: "http://sts/oidc/revoke",
    //end_session_endpoint:  "http://sts/oidc/logout",
  },
}



root.render(
  <React.StrictMode>
    <AuthProvider  {...oidcConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
