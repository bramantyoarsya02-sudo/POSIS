import { ProtectedAdminRoute } from '@/components/auth/RouteGuards';
import { AdminDashboard } from '@/views/Admin/Dashboard';

export default function AdminDashboardPage() {
  return (
    <ProtectedAdminRoute>
      <AdminDashboard />
    </ProtectedAdminRoute>
  );
}

