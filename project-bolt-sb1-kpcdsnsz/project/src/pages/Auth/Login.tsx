import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

const Login = () => {
  const { login, isAuthenticated, error, clearError, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({ email: '', password: '' });

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const errors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (validate()) {
      try {
        await login(email, password);
      } catch (err) {
        // Error will be handled by auth context
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-primary-500" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-500 hover:text-primary-600">
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-md p-4 flex">
              <AlertCircle className="h-5 w-5 text-error-500 mr-3 flex-shrink-0" />
              <p className="text-sm text-error-700">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              error={formErrors.email}
            />
            
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              error={formErrors.password}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-primary-500 hover:text-primary-600">
                Forgot your password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;