import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from './AuthProvider';
import { GraduationCap, User, Lock, AlertCircle, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    }
  };

  const handleDemoLogin = (role: 'admin' | 'staff') => {
    if (role === 'admin') {
      setEmail('admin@demo.com');
      setPassword('admin123');
    } else {
      setEmail('staff@demo.com');
      setPassword('staff123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Fees Management System</CardTitle>
            <CardDescription>Demo Login - Choose your role</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Login Buttons */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-center text-muted-foreground">
              Quick Demo Login
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('admin')}
                className="flex flex-col h-auto py-3"
              >
                <User className="h-5 w-5 mb-1" />
                <span className="text-xs">Admin</span>
                <span className="text-xs text-muted-foreground">Full Access</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('staff')}
                className="flex flex-col h-auto py-3"
              >
                <User className="h-5 w-5 mb-1" />
                <span className="text-xs">Staff</span>
                <span className="text-xs text-muted-foreground">View Only</span>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or login manually</span>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg space-y-2">
            <p className="font-medium">Demo Credentials:</p>
            <div className="space-y-1">
              <p><strong>Admin:</strong> admin@demo.com / admin123</p>
              <p><strong>Staff:</strong> staff@demo.com / staff123</p>
            </div>
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-xs"><strong>Admin:</strong> Full CRUD access to all features</p>
              <p className="text-xs"><strong>Staff:</strong> View and export reports only</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};