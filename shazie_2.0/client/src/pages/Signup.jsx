import { useState } from 'react';
import png from '../assets/codecollab-high-resolution-logo-grayscale-transparent.png';
import Authgitgoogle from '../components/authgitgoogle';

export default function Signup() {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    const strengthCriteria = [
      { regex: /[a-z]/, message: '✔ At least one lowercase letter' },
      { regex: /[A-Z]/, message: '✔ At least one uppercase letter' },
      { regex: /[0-9]/, message: '✔ At least one number' },
      { regex: /[^A-Za-z0-9]/, message: '✔ At least one special character' },
      { regex: /.{8,}/, message: '✔ Minimum 8 characters' },
    ];

    const matchedCriteria = strengthCriteria.filter((criteria) => criteria.regex.test(password));
    setPasswordStrength(
      matchedCriteria.length === strengthCriteria.length
        ? '✅ Strong Password'
        : `⚠ Weak Password: ${matchedCriteria.map((c) => c.message).join(', ')}`
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('❌ Passwords do not match!');
      return;
    }

    if (!passwordStrength.includes('✅ Strong Password')) {
      setError('❌ Password is too weak!');
      return;
    }

    setError('');
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <a href="/">
          <img alt="Your Company" src={png} className="mx-auto h-10 w-auto" />
        </a>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign up for your account
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
            />
            <p className={`mt-1 text-sm ${passwordStrength.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {passwordStrength}
            </p>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            Sign up
          </button>
        </form>
        <p className="mt-10 text-center text-sm/6 text-gray-500">
            Have an account?{' '}
            <a href="/signin" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Signin
            </a>
        </p>
        <Authgitgoogle />
      </div>
    </div>
  );
}
