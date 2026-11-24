import { ProtectedRoute } from '@/components/auth/RouteGuards';
import { LostFoundIndex } from '@/views/LostFound/Index';

export default function LostFoundPage() {
  return (
    <ProtectedRoute>
      <LostFoundIndex />
    </ProtectedRoute>
  );
}

