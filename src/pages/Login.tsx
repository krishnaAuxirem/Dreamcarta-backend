import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { isFirebaseConfigured } from '@/lib/firebase';

export default function LoginPage() {
  const { login, loginWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLogin = location.pathname === '/admin/login';
  const [role, setRole] = useState<'user' | 'mentor' | 'admin'>(isAdminLogin ? 'admin' : 'user');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const showGoogleLogin = isFirebaseConfigured();

  useEffect(() => {
    setRole(isAdminLogin ? 'admin' : 'user');
  }, [isAdminLogin]);

  const handleRoleRouting = (signedInRole: 'user' | 'mentor' | 'admin' | undefined): boolean => {
    if (!signedInRole) {
      setError('Role information missing from login response.');
      return false;
    }

    if (signedInRole !== role) {
      logout();
      setError(`This account is ${signedInRole}. Please choose ${signedInRole} tab to continue.`);
      return false;
    }

    if (signedInRole === 'mentor') {
      navigate('/mentor');
      return true;
    }

    navigate(signedInRole === 'admin' ? '/admin' : '/dashboard');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const result = await login(form.email, form.password, role);
    setLoading(false);
    if (result.success) {
      handleRoleRouting(result.role);
    } else {
      setError(result.error || 'Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    const result = await loginWithGoogle();
    setGoogleLoading(false);

    if (result.success) {
      handleRoleRouting(result.role);
    } else {
      setError(result.error || 'Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute w-2 h-2 bg-white rounded-full float-anim" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 4}s` }} />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">Welcome Back!</h2>
          <p className="text-white/70 text-lg mb-8 max-w-sm">Your dreams are waiting. Let's pick up where you left off.</p>
          <div className="grid grid-cols-3 gap-4 text-center text-white">
            {[['2.5M+', 'Dreamers'], ['18M+', 'Goals'], ['89%', 'Success']].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold">{v}</div>
                <div className="text-white/60 text-xs">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">DreamCarta</span>
          </div>

          <h1 className="font-display text-3xl font-bold mb-1">
            {role === 'admin' ? 'Admin Sign In' : role === 'mentor' ? 'Mentor Sign In' : 'User Sign In'}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {role === 'admin'
              ? <>Admin account only. Have a user account? <button type="button" className="text-primary hover:underline font-medium" onClick={() => setRole('user')}>User login</button></>
              : <>Don't have an account? <Link to="/register" className="text-primary hover:underline font-medium">Sign up free</Link></>}
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Sign in as</label>
              <div className="flex bg-muted rounded-lg p-1 mb-4">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`flex-1 py-2 text-sm rounded-md ${
                    role === 'user' ? 'bg-indigo-500 text-white' : 'text-muted-foreground'
                  }`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('mentor')}
                  className={`flex-1 py-2 text-sm rounded-md ${
                    role === 'mentor' ? 'bg-indigo-500 text-white' : 'text-muted-foreground'
                  }`}
                >
                  Mentor
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-2 text-sm rounded-md ${
                    role === 'admin' ? 'bg-indigo-500 text-white' : 'text-muted-foreground'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" required className="w-full px-4 py-3 pr-11 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" className="accent-primary" /> Remember me
              </label>
              <button type="button" className="text-sm text-primary hover:underline">Forgot password?</button>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2 py-3">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {showGoogleLogin && (
            <>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleGoogleLogin()}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors text-sm font-medium"
              >
                {googleLoading ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.3 14.6 2.4 12 2.4 6.8 2.4 2.6 6.6 2.6 11.8S6.8 21.2 12 21.2c6.9 0 9.5-4.8 9.5-7.2 0-.5 0-.9-.1-1.3H12z"/>
                  </svg>
                )}
                <span>{googleLoading ? 'Signing in...' : 'Continue with Google'}</span>
              </button>
            </>
          )}

          <p className="text-center text-xs text-muted-foreground mt-6">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms</Link> and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
