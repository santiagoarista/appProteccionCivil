// Utility functions for user authentication and role management

export interface User {
  id: number;
  username: string;
  role: 'paramedico' | 'jefe_turno' | 'administrador';
  turnoId?: number;
}

export const getCurrentUser = (): User | null => {
  const userJson = sessionStorage.getItem("user");
  if (!userJson) return null;
  
  const user = JSON.parse(userJson);
  
  return {
    id: user.id,
    username: user.username,
    role: user.role as User['role'],
    turnoId: user.turnoId,
  };
};

export const getUserRole = (): string | null => {
  const userJson = sessionStorage.getItem("user");
  if (!userJson) return null;
  
  const user = JSON.parse(userJson);
  return user.role;
};

export const isAdmin = (): boolean => {
  return getUserRole() === 'administrador';
};

export const isJefeTurno = (): boolean => {
  return getUserRole() === 'jefe_turno';
};

export const isColaborador = (user?: User | null) => {
  return !!user && user.role === "paramedico";
};

export const canManageUsers = (): boolean => {
  const role = getUserRole();
  return role === 'administrador' || role === 'jefe_turno';
};

export const canCreateReports = (): boolean => {
  return getUserRole() !== null; // All authenticated users can create reports
};

export const canManageInsumos = (): boolean => {
  const role = getUserRole();
  return role === 'administrador' || role === 'jefe_turno';
};