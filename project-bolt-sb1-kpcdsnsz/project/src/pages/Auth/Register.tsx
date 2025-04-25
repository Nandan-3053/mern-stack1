import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

const Register = () => {
  const { register, isAuthenticated, error, clearError, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const validate = () => {
    const errors = {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    };
    let isValid = true;

    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

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
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (password !== passwordConfirm) {
      errors.passwordConfirm = 'Passwords do not match';
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
        await register(name, email, password);
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
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">
              sign in to existing account
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
              label="Full Name"
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="h-5 w-5 text-gray-400" />}
              error={formErrors.name}
            />
            
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              error={formErrors.password}
            />
            
            <Input
              label="Confirm Password"
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
              error={formErrors.passwordConfirm}
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <Link to="/terms" className="font-medium text-primary-500 hover:text-primary-600">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-medium text-primary-500 hover:text-primary-600">
                Privacy Policy
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;