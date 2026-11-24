import { PublicOnlyRoute } from '@/components/auth/RouteGuards';
import { AuthPage } from '@/views/AuthPage';

export default function Page() {
  return (
    <PublicOnlyRoute>
      <AuthPage />
    </PublicOnlyRoute>
  );
}

