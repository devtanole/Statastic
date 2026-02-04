import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export function RegistrationForm() {
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
      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      // const user = (await res.json()) as User;
      // alert(`Successfully registered ${user.username} as userId ${user.userId}`);
      navigate('/auth/sign-in');
    } catch (err) {
      alert(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 px-4 bg-black text-white">
      <div className="w-full max-w-md p-6 border border-neutral-800 rounded-md shadow-lg bg-neutral-900">
        <h2 className="text-xl font-bold mb-4 text-center text-[#D4AF37]">
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-3 text-sm">
            Full Name
            <input
              required
              name="fullName"
              type="text"
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </label>

          <label className="block mb-3 text-sm">
            Username
            <input
              required
              name="username"
              type="text"
              className="mt-1 block w-full rounded p-2 bg-black border border-neutral-700 text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </label>

          <label className="block mb-4 text-sm">
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
            {isLoading ? 'Registering…' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already registered?{' '}
          <Link to="/auth/sign-in" className="text-[#D4AF37] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
