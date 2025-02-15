import { signIn } from 'next-auth/react';

export default function Authgitgoogle() {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <button
        onClick={() => signIn('github')}
        className="flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-white shadow hover:bg-gray-800"
      >
        Sign in with GitHub
      </button>
      <button
        onClick={() => signIn('google')}
        className="flex w-full items-center justify-center rounded-md bg-red-600 px-4 py-2 text-white shadow hover:bg-red-500"
      >
        Sign in with Google
      </button>
    </div>
  );
}