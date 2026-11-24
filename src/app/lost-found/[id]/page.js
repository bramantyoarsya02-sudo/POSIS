import { ProtectedRoute } from '@/components/auth/RouteGuards';
import { LostFoundDetail } from '@/views/LostFound/Detail';

export default function LostFoundDetailPage() {
  return (
    <ProtectedRoute>
      <LostFoundDetail />
    </ProtectedRoute>
  );
}

