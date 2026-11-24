import { ProtectedRoute } from '@/components/auth/RouteGuards';
import { AspirasiIndex } from '@/views/Aspirasi/Index';

export default function AspirasiPage() {
  return (
    <ProtectedRoute>
      <AspirasiIndex />
    </ProtectedRoute>
  );
}

