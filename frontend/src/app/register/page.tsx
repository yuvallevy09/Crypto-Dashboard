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
import { RegisterRequest } from '@crypto-dashboard/shared';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    name: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string>('');



  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      setErrors({});
      setGeneralError('');
      setUser(data.user);
      setToken(data.token);
      router.push('/onboarding');
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        // Handle validation errors
        if (error.response?.data?.details) {
          // Set field-specific errors
          const fieldErrors: { [key: string]: string } = {};
          error.response.data.details.forEach((detail: any) => {
            fieldErrors[detail.field] = detail.message;
          });
          setErrors(fieldErrors);
          setGeneralError(''); // Clear general error
        } else {
          // Set general error for non-validation 400 errors
          setGeneralError(error.response?.data?.error || 'Invalid input data');
          setErrors({}); // Clear field errors
        }
      } else if (error.response?.status === 409) {
        setGeneralError('Email already exists');
        setErrors({}); // Clear field errors
      } else if (error.response?.data?.error) {
        setGeneralError(error.response.data.error);
        setErrors({}); // Clear field errors
      } else {
        setGeneralError('Registration failed. Please try again.');
        setErrors({}); // Clear field errors
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear previous errors
    setErrors({});
    setGeneralError('');
    registerMutation.mutate(formData);
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
          <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join Crypto Dashboard to get started
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={getFieldError('name') ? 'border-red-500' : ''}
                autoComplete="name"
              />
              {getFieldError('name') && (
                <p className="text-red-500 text-xs">{getFieldError('name')}</p>
              )}
            </div>
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
                autoComplete="email"
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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className={getFieldError('password') ? 'border-red-500' : ''}
                autoComplete="new-password"
              />
              {getFieldError('password') && (
                <p className="text-red-500 text-xs">{getFieldError('password')}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
