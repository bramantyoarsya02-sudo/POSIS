import { ProtectedRoute } from '@/components/auth/RouteGuards';
import { PanduanFaq } from '@/views/PanduanFaq';

export default function PanduanFaqPage() {
  return (
    <ProtectedRoute>
      <PanduanFaq />
    </ProtectedRoute>
  );
}

