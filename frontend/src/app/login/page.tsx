'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { LoginRequest } from '@crypto-dashboard/shared';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string>('');

  const loginMutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      try {
        const response = await authAPI.login(data);
        return response;
      } catch (error: any) {
        // Handle validation errors specifically
        if (error.response?.status === 400) {
          if (error.response?.data?.details) {
            // Clear general error and set field-specific errors
            setGeneralError('');
            const fieldErrors: { [key: string]: string } = {};
            error.response.data.details.forEach((detail: any) => {
              fieldErrors[detail.field] = detail.message;
            });
            setErrors(fieldErrors);
            throw error; // Re-throw to trigger onError
          }
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      setErrors({});
      setGeneralError('');
      setUser(data.user);
      setToken(data.token);
      router.push('/dashboard');
    },
    onError: (error: any) => {
      let errorMessage = 'Login failed';
      
      if (error.response?.status === 400) {
        // Validation errors are already handled above
        if (!error.response?.data?.details) {
          setGeneralError(error.response?.data?.error || 'Invalid input data');
        }
      } else if (error.response?.status === 401) {
        // Authentication error
        setGeneralError('Invalid email or password');
      } else if (error.response?.data?.error) {
        setGeneralError(error.response.data.error);
      } else {
        setGeneralError('Login failed. Please try again.');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear previous errors
    setErrors({});
    setGeneralError('');
    loginMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getFieldError = (fieldName: string) => errors[fieldName] || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Crypto Dashboard</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generalError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{generalError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={getFieldError('email') ? 'border-red-500' : ''}
              />
              {getFieldError('email') && (
                <p className="text-red-500 text-xs">{getFieldError('email')}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className={getFieldError('password') ? 'border-red-500' : ''}
              />
              {getFieldError('password') && (
                <p className="text-red-500 text-xs">{getFieldError('password')}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div
            className="mt-4 text-center text-sm"
          >
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
