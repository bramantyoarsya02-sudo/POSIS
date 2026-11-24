import { ProtectedRoute } from '@/components/auth/RouteGuards';
import { AspirasiDetail } from '@/views/Aspirasi/Detail';

export default function AspirasiDetailPage() {
  return (
    <ProtectedRoute>
      <AspirasiDetail />
    </ProtectedRoute>
  );
}

