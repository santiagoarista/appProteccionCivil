import { AuthProvider } from "react-admin";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const request = new Request(`${API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });

    try {
      const response = await fetch(request);

      if (response.status < 200 || response.status >= 300) {
        throw new Error(response.statusText);
      }

      const auth = await response.json();

      // Store authentication information in sessionStorage (matching pasted project)
      sessionStorage.setItem("auth", auth.token);
      sessionStorage.setItem(
        "identity",
        JSON.stringify({ id: auth.id, fullName: auth.nombre }),
      );
      // Also store user data for getPermissions
      sessionStorage.setItem("user", JSON.stringify(auth.user));

      return Promise.resolve();
    } catch (error) {
      throw new Error("Error en usuario o password");
    }
  },

  logout: () => {
    sessionStorage.removeItem("auth");
    sessionStorage.removeItem("identity");
    sessionStorage.removeItem("user");
    return Promise.resolve();
  },

  checkAuth: () => {
    return sessionStorage.getItem("auth")
      ? Promise.resolve()
      : Promise.reject();
  },

  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("identity");
      sessionStorage.removeItem("user");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => {
    const userJson = sessionStorage.getItem("user");
    if (!userJson) return Promise.resolve({});

    const user = JSON.parse(userJson);
    const role = user.role;

    return Promise.resolve({
      role: role,
      userId: user.id,
      turnoId: user.turnoId, // Include turnoId for jefe de turno filtering
      canEdit: role === "administrador" || role === "jefe_turno",
      canDelete: role === "administrador",
      canViewAllReports: role === "administrador",
      canCreateReports: true,
    });
  },

  getIdentity: () => {
    const identityJson = sessionStorage.getItem("identity");
    if (!identityJson) return Promise.reject();

    const identity = JSON.parse(identityJson);
    return Promise.resolve({
      id: identity.id,
      fullName: identity.fullName,
      avatar: undefined,
    });
  },
};

export default authProvider;
