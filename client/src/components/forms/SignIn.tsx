import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../useUser';
import type { Auth } from '../../lib/data';

export function SignIn() {
  const { handleSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { user, token } = (await res.json()) as Auth;
      handleSignIn(user, token);
      navigate('/');
    } catch (err) {
      alert(`Error signing in: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 px-4 bg-black text-white">
      <div className="w-full max-w-md p-6 border border-neutral-800 rounded-md shadow-lg bg-neutral-900">
        <h2 className="text-xl font-bold mb-4 text-center text-[#D4AF37]">
          Sign In
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-3 text-sm">
            Username
            <input
              required
              name="username"
              type="text"
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </label>
          <label className="block mb-3 text-sm">
            Password
            <input
              required
              name="password"
              type="password"
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </label>
          <button
            disabled={isLoading}
            className="
            w-full py-2 rounded
            bg-[#D4AF37] text-black font-semibold
            hover:bg-[#c9a633]
            transition
            disabled:opacity-50
          ">
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-400">
          New user?{' '}
          <Link to="/auth/sign-up" className="text-[#D4AF37] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
