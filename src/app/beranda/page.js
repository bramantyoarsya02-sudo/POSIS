import { ProtectedRoute } from '@/components/auth/RouteGuards';
import { Home } from '@/views/Home';

export default function BerandaPage() {
  return (
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  );
}

