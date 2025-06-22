import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ValidationState {
  fullName: { isValid: boolean; message: string };
  email: { isValid: boolean; message: string };
  password: { isValid: boolean; message: string };
  confirmPassword: { isValid: boolean; message: string };
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [validation, setValidation] = useState<ValidationState>({
    fullName: { isValid: false, message: '' },
    email: { isValid: false, message: '' },
    password: { isValid: false, message: '' },
    confirmPassword: { isValid: false, message: '' }
  });

  // Validation functions
  const validateFullName = (name: string): boolean => {
    return name.trim().length >= 2 && name.trim().length <= 50;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
    return password === confirmPassword && password.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate all fields
    const isFullNameValid = validateFullName(formData.fullName);
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);
    const isPasswordMatchValid = validatePasswordMatch(formData.password, formData.confirmPassword);

    setValidation({
      fullName: {
        isValid: isFullNameValid,
        message: isFullNameValid ? '' : 'Full name must be between 2 and 50 characters'
      },
      email: {
        isValid: isEmailValid,
        message: isEmailValid ? '' : 'Please enter a valid email address'
      },
      password: {
        isValid: isPasswordValid,
        message: isPasswordValid ? '' : 'Password must be at least 8 characters long'
      },
      confirmPassword: {
        isValid: isPasswordMatchValid,
        message: isPasswordMatchValid ? '' : 'Passwords do not match'
      }
    });

    if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isPasswordMatchValid) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      if (response.token) {
        // Store the token and user data
        localStorage.setItem('memoirbox_token', response.token);
        localStorage.setItem('memoirbox_user', JSON.stringify({
          email: formData.email,
          name: formData.fullName
        }));
        
        // Show success message
        setSuccess('Registration successful! Redirecting to gallery...');
        
        // Wait for 2 seconds before redirecting
        setTimeout(() => {
          navigate('/gallery');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Registration Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 transform transition-all duration-300 hover:shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-2">Create Account</h1>
            <p className="text-text-secondary">Join our community of memory keepers</p>
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-text-primary mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  setValidation({
                    ...validation,
                    fullName: {
                      isValid: validateFullName(e.target.value),
                      message: validateFullName(e.target.value) ? '' : 'Full name must be between 2 and 50 characters'
                    }
                  });
                }}
                className={`input ${validation.fullName.message ? 'border-error' : ''}`}
                placeholder="Enter your full name"
              />
              {validation.fullName.message && (
                <p className="mt-1 text-sm text-error">{validation.fullName.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setValidation({
                    ...validation,
                    email: {
                      isValid: validateEmail(e.target.value),
                      message: validateEmail(e.target.value) ? '' : 'Please enter a valid email address'
                    }
                  });
                }}
                className={`input ${validation.email.message ? 'border-error' : ''}`}
                placeholder="Enter your email"
              />
              {validation.email.message && (
                <p className="mt-1 text-sm text-error">{validation.email.message}</p>
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
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setValidation({
                      ...validation,
                      password: {
                        isValid: validatePassword(e.target.value),
                        message: validatePassword(e.target.value) ? '' : 'Password must be at least 8 characters long'
                      }
                    });
                  }}
                  className={`input ${validation.password.message ? 'border-error' : ''}`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  )}
                </button>
              </div>
              {validation.password.message && (
                <p className="mt-1 text-sm text-error">{validation.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    setValidation({
                      ...validation,
                      confirmPassword: {
                        isValid: validatePasswordMatch(formData.password, e.target.value),
                        message: validatePasswordMatch(formData.password, e.target.value) ? '' : 'Passwords do not match'
                      }
                    });
                  }}
                  className={`input ${validation.confirmPassword.message ? 'border-error' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-text-primary transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  )}
                </button>
              </div>
              {validation.confirmPassword.message && (
                <p className="mt-1 text-sm text-error">{validation.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-600 text-black font-medium py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-600 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 