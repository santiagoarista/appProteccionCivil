import { useGetList } from "react-admin";
import { Card, CardContent, CardHeader, Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TodayIcon from "@mui/icons-material/Today";
import PeopleIcon from "@mui/icons-material/People";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#6366f1",
];

export const Dashboard = () => {
  const { data: reportes, isLoading } = useGetList("reportes", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "fecha", order: "DESC" },
  });

  const { data: users } = useGetList("users", {
    pagination: { page: 1, perPage: 1000 },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Cargando estadísticas..." />
      </Card>
    );
  }

  // Calculate statistics
  const totalReportes = reportes?.length || 0;
  const totalUsers = users?.length || 0;

  // Reports this month
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const reportesThisMonth =
    reportes?.filter((r: any) => {
      const reportDate = new Date(r.fecha);
      return reportDate >= thisMonth;
    }).length || 0;

  // Reports by tipo_reporte
  const reportesByTipo: Record<string, number> = {};
  reportes?.forEach((r: any) => {
    const tipo = r.tipo_reporte || "Sin especificar";
    reportesByTipo[tipo] = (reportesByTipo[tipo] || 0) + 1;
  });
  const tipoData = Object.entries(reportesByTipo).map(([name, value]) => ({
    name,
    value,
  }));

  // Reports by emergency type (motivo_atencion)
  const reportesByEmergency: Record<string, number> = {};
  reportes?.forEach((r: any) => {
    const tipo = r.datos_servicio?.motivo_atencion || "Sin especificar";
    reportesByEmergency[tipo] = (reportesByEmergency[tipo] || 0) + 1;
  });
  const emergencyData = Object.entries(reportesByEmergency).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  // Reports over time (last 12 months)
  const monthlyData: Record<string, number> = {};
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = date.toLocaleDateString("es-MX", {
      month: "short",
      year: "numeric",
    });
    monthlyData[key] = 0;
  }
  reportes?.forEach((r: any) => {
    const date = new Date(r.fecha);
    const key = date.toLocaleDateString("es-MX", {
      month: "short",
      year: "numeric",
    });
    if (monthlyData[key] !== undefined) {
      monthlyData[key]++;
    }
  });
  const timelineData = Object.entries(monthlyData).map(([month, total]) => ({
    month,
    total,
  }));

  return (
    <Box sx={{ p: 2 }}>
      {/* Summary Cards */}
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <Card sx={{ flex: "1 1 300px", minWidth: 250 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <AssessmentIcon sx={{ fontSize: 48, color: "#3b82f6" }} />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {totalReportes}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Reportes
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 300px", minWidth: 250 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TodayIcon sx={{ fontSize: 48, color: "#8b5cf6" }} />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {reportesThisMonth}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reportes Este Mes
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 300px", minWidth: 250 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <PeopleIcon sx={{ fontSize: 48, color: "#ec4899" }} />
              <Box>
                <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                  {totalUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Usuarios
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Charts Row 1: Timeline and Tipo */}
      <Box sx={{ display: "flex", gap: 3, mb: 3, flexWrap: "wrap" }}>
        <Card sx={{ flex: "1 1 500px", minWidth: 400 }}>
          <CardHeader title="Reportes por Mes" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card sx={{ flex: "1 1 400px", minWidth: 300 }}>
          <CardHeader title="Reportes por Tipo" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tipoData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {tipoData.map((_entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Charts Row 2: Emergency Types */}
      <Card sx={{ mb: 3 }}>
        <CardHeader title="Reportes por Tipo de Emergencia" />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emergencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
};
