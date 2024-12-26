import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <Heart className="w-16 h-16 text-pink-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Family Coach</h1>
        <p className="text-gray-600 mb-8">
          Your family's guide to growth and success
        </p>
        
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        <p className="mt-6 text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}