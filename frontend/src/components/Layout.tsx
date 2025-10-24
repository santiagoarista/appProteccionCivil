import * as React from "react";
import { forwardRef } from "react";
import {
  AppBar,
  Layout,
  UserMenu,
  useLogout,
  Menu,
  usePermissions,
  type LayoutProps,
} from "react-admin";
import { MenuItem } from "@mui/material";
import ExitIcon from "@mui/icons-material/PowerSettingsNew";

const MyLogoutButton = forwardRef<
  HTMLLIElement,
  React.ComponentProps<typeof MenuItem>
>((props, ref) => {
  const logout = useLogout();
  return (
    <MenuItem onClick={() => logout()} ref={ref} {...props}>
      <ExitIcon fontSize="small" style={{ marginRight: 8 }} />
      Logout
    </MenuItem>
  );
});
MyLogoutButton.displayName = "MyLogoutButton";

const MyUserMenu: React.FC = () => (
  <UserMenu>
    <MyLogoutButton />
  </UserMenu>
);

const MyAppBar: React.FC<React.ComponentProps<typeof AppBar>> = (props) => (
  <AppBar
    {...props}
    userMenu={<MyUserMenu />}
    sx={{
      "& .RaAppBar-toolbar": {
        minHeight: "56px",
        color: "#ffffff",
      },
      "& .MuiButton-root": {
        color: "#ffffff",
      },
      "& .MuiIconButton-root": {
        color: "#ffffff",
      },
    }}
  />
);

// Custom Menu that conditionally shows Dashboard
const MyMenu: React.FC = () => {
  const { permissions } = usePermissions();

  // Only show dashboard menu item for administrators
  const hasDashboard = permissions?.role === "administrador";

  return <Menu hasDashboard={hasDashboard} />;
};

const MyLayout: React.FC<LayoutProps> = (props) => (
  <Layout
    {...props}
    appBar={MyAppBar}
    menu={MyMenu}
    sx={{
      // Force light theme colors
      color: "#1f2937",

      // Main content area - light gradients
      "& .RaLayout-content": {
        background:
          "linear-gradient(135deg, #d4eeffff 0%, #e0f2fe 50%, #e0efffff 100%)",
        minHeight: "100vh",
        color: "#1f2937",
      },

      // Main content container
      "& main.RaLayout-main": {
        background: "linear-gradient(145deg, #ffffff 0%, #f9fafb 100%)",
        padding: "24px",
        borderRadius: "16px",
        margin: "8px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
        color: "#1f2937",
      },

      // Cards - white with dark text
      "& .MuiCard-root": {
        background: "linear-gradient(145deg, #ffffff 0%, #fefefe 100%)",
        margin: "16px",
        borderRadius: "16px",
        border: "none",
        boxShadow:
          "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
        color: "#1f2937",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)",
        },
      },

      // Sidebar styling
      "& .RaLayout-sidebar": {
        background: "linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)",
        borderRight: "1px solid rgba(226, 232, 240, 0.6)",
        boxShadow: "4px 0 16px rgba(0, 0, 0, 0.04)",
      },

      "& .MuiInputBase-input": {
        color: "#1f2937",
      },

      // Typography
      "& .MuiTypography-root": {
        color: "#1f2937",
      },
    }}
  />
);

export default MyLayout;
