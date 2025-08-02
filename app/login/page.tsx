'use client';

import { useState } from 'react';
import { useAccount } from '@/lib/AccountProvider';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAccount();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Add your login logic here
    try {
      // Example: await signIn(email, password);
      console.log('Login attempt:', { email, password });
      const success = await login(email, 'dummy-jwt-token'); // Replace with actual JWT token from your auth service

      if (success) {
        router.push('/'); // Redirect to home or dashboard after successful login
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-2 px-4 rounded-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
            Forgot your password?
          </a>
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm text-gray-400">Don't have an account? </span>
          <a href="/register" className="text-sm text-blue-400 hover:text-blue-300">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
