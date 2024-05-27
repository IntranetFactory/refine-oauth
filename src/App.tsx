import {
  AuthProvider,
  Authenticated,
  GitHubBanner,
  Refine,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  ThemedTitleV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { useAuth } from "react-oidc-context";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { App as AntdApp } from "antd";
import axios from "axios";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { AppIcon } from "./components/app-icon";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import { Login } from "./pages/login";

function App() {
  const { isLoading, error, isAuthenticated, activeNavigator, user, removeUser, signinRedirect, signoutRedirect } = useAuth();

  switch (activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (isLoading) {
    return <span>loading...</span>;
  }

  if (error) {
    return <span>Oops... {error.message}</span>;
}

  const authProvider: AuthProvider = {
    login: async () => {
      return {
        success: true,
      };
    },
    logout: async () => {
      signoutRedirect(); //{ returnTo: window.location.origin });
      return {
        success: true,
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      try {
        const authenticated = !!user?.profile?.authenticated;       
        if (authenticated) {          
          axios.defaults.headers.common = {
            Authorization: `Bearer ${user.access_token}`,
          };
          return {
            authenticated: true,
          };
        } else {         
          return {
            authenticated: false,
            error: {
              message: "Check failed",
              name: "Token not found",
            },
            redirectTo: "/login",
            logout: true,
          };
        }
      } catch (error: any) {
        console.error(error);      
        return {
          authenticated: false,
          error: new Error(error),
          redirectTo: "/login",
          logout: true,
        };
      }
    },
    getPermissions: async () => null,
    getIdentity: async () => {            
      if (user?.profile) {
        return user.profile;
      }
      return null;
    },
  };

  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
                notificationProvider={useNotificationProvider}
                authProvider={authProvider}
                routerProvider={routerBindings}
                resources={[
                  {
                    name: "blog_posts",
                    list: "/blog-posts",
                    create: "/blog-posts/create",
                    edit: "/blog-posts/edit/:id",
                    show: "/blog-posts/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                  {
                    name: "categories",
                    list: "/categories",
                    create: "/categories/create",
                    edit: "/categories/edit/:id",
                    show: "/categories/show/:id",
                    meta: {
                      canDelete: true,
                    },
                  },
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "jTKqbB-5ziFIS-bf06Ya",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2
                          Header={() => <Header sticky />}
                          Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                          Title={({ collapsed }) => (
                            <ThemedTitleV2
                              collapsed={collapsed}
                              text="Refine Project"
                              icon={<AppIcon />}
                            />
                          )}
                        >
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="blog_posts" />}
                    />
                    <Route path="/blog-posts">
                      <Route index element={<BlogPostList />} />
                      <Route path="create" element={<BlogPostCreate />} />
                      <Route path="edit/:id" element={<BlogPostEdit />} />
                      <Route path="show/:id" element={<BlogPostShow />} />
                    </Route>
                    <Route path="/categories">
                      <Route index element={<CategoryList />} />
                      <Route path="create" element={<CategoryCreate />} />
                      <Route path="edit/:id" element={<CategoryEdit />} />
                      <Route path="show/:id" element={<CategoryShow />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
