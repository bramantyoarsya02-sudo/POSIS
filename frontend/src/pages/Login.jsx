import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/common/Button';
import { ShieldCheck, User, KeyRound, Lock } from 'lucide-react';
import { AdminLoginModal } from '../components/auth/AdminLoginModal';

export function Login() {
  const { login, switchRole } = useAuth();
  const navigate = useNavigate();
  const [identity, setIdentity] = useState('0067823910'); // Sample NISN
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ identity, password });
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-posis-bone">
      <div className="w-full max-w-md bg-white border-2 border-posis-blue rounded-[2px] editorial-shadow p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-white p-2 border-2 border-posis-blue rounded-[2px] editorial-shadow-sm flex items-center justify-center">
            <img
              src="/assets/logo-smkn1-ciomas.png"
              alt="Logo SMKN 1 Ciomas"
              width="56"
              height="56"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="font-serif text-3xl font-bold text-posis-blue">Masuk ke POSIS</h2>
          <p className="font-mono text-xs text-stone-500 uppercase">
            PORTAL RESMI SMKN 1 CIOMAS
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
              NISN atau Email Sekolah
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
              <input
                type="text"
                required
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
                placeholder="Contoh: 0067823910 atau email@siswa..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-posis-bone border border-stone-400 focus:border-posis-blue rounded-[2px] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase font-semibold text-posis-ink mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-3 text-stone-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-posis-bone border border-stone-400 focus:border-posis-blue rounded-[2px] outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Memverifikasi...' : 'Masuk Sekarang'}
          </Button>
        </form>

        {/* Tautan ke Pemilihan Peran */}
        <div className="pt-4 border-t border-stone-300 text-center">
          <Link
            to="/pilih-peran"
            className="font-mono text-xs text-posis-blue font-bold underline hover:text-posis-blue-dark block"
          >
            Halaman Pemilihan Peran (Siswa &amp; Admin) &rarr;
          </Link>
        </div>
      </div>

      {/* Modal Login Admin dengan Animasi Logo Berputar */}
      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onSuccess={() => {
          setAdminModalOpen(false);
          navigate('/admin/dashboard');
        }}
      />
    </div>
  );
}
