import { useState } from 'react';
import { useLocation } from 'wouter';
import { ShieldCheck, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);
    setLoading(false);

    if (success) {
      toast({
        title: 'Welcome back',
        description: 'You have been logged in successfully.',
      });
      setLocation('/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-primary text-primary-foreground">
            <ShieldCheck className="h-6 w-6" strokeWidth={2} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Fleet Operations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to the operations desk</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-border bg-card p-6 sm:p-8">
          <div className="space-y-4">
            <FormField label="Email" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@fleet.ug"
                required
                autoComplete="email"
              />
            </FormField>
            <FormField label="Password" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </FormField>
          </div>

          {error && (
            <p className="mt-4 text-xs text-destructive">{error}</p>
          )}

          <Button type="submit" className="mt-6 w-full" disabled={loading}>
            <LogIn className="h-4 w-4" />
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="mt-6 border-t border-border pt-4">
            <p className="text-[11px] text-muted-foreground">
              Contact your administrator for account credentials.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
