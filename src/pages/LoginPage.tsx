import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('Password is required');
      return false;
    } else if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      
      if (response.token) {
        // Store the token and user data
        localStorage.setItem('memoirbox_token', response.token);
        localStorage.setItem('memoirbox_user', JSON.stringify({
          email: response.user.email,
          name: response.user.name
        }));
        
        setSuccess('Login successful! Redirecting to gallery...');
        
        // Wait for 2 seconds before redirecting
        setTimeout(() => {
          navigate('/gallery');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 transform transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-text-secondary">Sign in to your account</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-success/10 border border-success rounded-lg text-success text-sm animate-fade-in">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error rounded-lg text-error text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                className={`input ${emailError ? 'border-error' : ''}`}
                placeholder="Enter your email"
              />
              {emailError && (
                <p className="mt-1 text-sm text-error">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  className={`input ${passwordError ? 'border-error' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1 text-sm text-error">{passwordError}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-text-secondary text-primary focus:ring-primary"
                />
                <span className="text-sm text-text-secondary">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-accent hover:text-accent-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full bg-primary py-3 px-4 rounded-lg hover:bg-primary-600 text-black"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:text-accent-600 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 