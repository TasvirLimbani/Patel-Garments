'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Lock, Mail, Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push('/dashboard');
    }
  }, [isLoggedIn, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting login with:", { email, password }); // debug
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.status) {
        login(email, password); // or store token
        router.push("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-40"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
        {/* Left side - Branding */}
        <div className="hidden md:flex flex-col justify-center items-center animate-slide-in-left">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-12 text-white">
              <LogIn size={64} className="mb-6 animate-pulse-glow" />
              <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
              <p className="text-lg opacity-90 mb-6">
                Access your employee management dashboard
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span>Real-time work tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span>Salary management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span>Employee records</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex flex-col justify-center animate-slide-in-right">
          <Card className="p-8 md:p-10 shadow-xl border-0">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">Sign In</h2>
              <p className="text-muted-foreground">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-primary opacity-60" size={20} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 py-2.5 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/30 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-primary opacity-60" size={20} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 py-2.5 bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-primary/30 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-primary opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/30 cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white py-2.5 font-semibold animate-fade-in transition-all duration-300"
                style={{ animationDelay: '0.4s' }}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">Or continue as</span>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <p className="text-xs text-muted-foreground mb-2 font-semibold">Demo Credentials:</p>
              <p className="text-xs text-foreground mb-1"><strong>Email:</strong> demo@example.com</p>
              <p className="text-xs text-foreground"><strong>Password:</strong> password123</p>
            </div>
          </Card>

          {/* Footer */}
          <p className="text-center text-muted-foreground text-sm mt-6 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            © 2024 Employee Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
