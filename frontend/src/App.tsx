import { Admin, Resource, defaultTheme, usePermissions } from "react-admin";
import { dataProvider } from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";
import { i18nProvider } from "./providers/i18nProvider";

import { UserCreate, UserEdit, UserList, UserShow } from "./resources/users";
import {
  TurnoList,
  TurnoEdit,
  TurnoCreate,
  TurnoShow,
} from "./resources/turnos";
import {
  ReporteList,
  ReporteEdit,
  ReporteShow,
  ReporteCreate,
} from "./resources/reportes/index";
import { LogList, LogShow } from "./resources/logs";

import MyLayout from "./components/Layout.tsx";
import { Dashboard } from "./components/Dashboard";

// Icons for resources
import PeopleIcon from "@mui/icons-material/People";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HistoryIcon from "@mui/icons-material/History";

// Conditional Dashboard - only for admins
const ConditionalDashboard = () => {
  const { permissions } = usePermissions();

  if (permissions?.role === "administrador") {
    return <Dashboard />;
  }

  // For non-admin users, redirect to reportes list
  return null;
};

// Custom theme with light colors and gradients
const customTheme = {
  ...defaultTheme,
  palette: {
    mode: "light" as const,
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
    },
    secondary: {
      main: "#8b5cf6",
      light: "#a78bfa",
      dark: "#7c3aed",
    },
    background: {
      default: "#f0f9ff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2937",
      secondary: "#4b5563",
    },
  },
  components: {
    ...defaultTheme.components,
    MuiAppBar: {
      styleOverrides: {
        root: {
          background:
            "linear-gradient(135deg, #dee9ffff 0%, #e3edffff 50%, #dfeaffff 100%)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
          borderRadius: "12px",
          minHeight: "56px",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(145deg, #ffffff 0%, #fefefe 100%)",
          borderRadius: "16px",
          boxShadow:
            "0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
};

export const App = () => {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      layout={MyLayout}
      i18nProvider={i18nProvider}
      theme={customTheme}
      dashboard={ConditionalDashboard}
    >
      {(permissions) => (
        <>
          {/* Reportes - available to all authenticated users */}
          <Resource
            name="reportes"
            list={ReporteList}
            edit={ReporteEdit}
            create={ReporteCreate}
            show={ReporteShow}
            icon={AssessmentIcon}
          />

          {/* Turnos - Admin only */}
          {permissions?.role === "administrador" && (
            <Resource
              name="turnos"
              list={TurnoList}
              edit={TurnoEdit}
              create={TurnoCreate}
              show={TurnoShow}
              icon={ScheduleIcon}
            />
          )}

          {/* Users and Logs - Admin only */}
          {permissions?.role === "administrador" && (
            <>
              <Resource
                name="users"
                list={UserList}
                edit={UserEdit}
                create={UserCreate}
                show={UserShow}
                icon={PeopleIcon}
              />
              <Resource
                name="logs"
                list={LogList}
                show={LogShow}
                icon={HistoryIcon}
              />
            </>
          )}
        </>
      )}
    </Admin>
  );
};
