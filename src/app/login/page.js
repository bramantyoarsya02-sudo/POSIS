import { PublicOnlyRoute } from '@/components/auth/RouteGuards';
import { AuthPage } from '@/views/AuthPage';

export default function LoginPage() {
  return (
    <PublicOnlyRoute>
      <AuthPage />
    </PublicOnlyRoute>
  );
}

