import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './providers/AuthProvider';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { defaultAuthenticatedPath, PermissionRoute } from './routes/PermissionRoute';
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { PointOfSalePage } from '../features/pos/pages/PointOfSalePage';
import { SalesHistoryPage } from '../features/sales/pages/SalesHistoryPage';

export default function App() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const home = defaultAuthenticatedPath(user?.permissions);

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100" aria-label="Cargando sesión">
        <span className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </main>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={home} replace /> : <LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<Navigate to={home} replace />} />
          <Route path="/dashboard" element={<PermissionRoute permission="reports.view"><DashboardPage /></PermissionRoute>} />
          <Route path="/pos" element={<PermissionRoute permission="sales.create"><PointOfSalePage /></PermissionRoute>} />
          <Route path="/sales" element={<PermissionRoute permissions={["sales.view_all", "sales.view_own"]}><SalesHistoryPage /></PermissionRoute>} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? home : '/login'} replace />} />
    </Routes>
  );
}
