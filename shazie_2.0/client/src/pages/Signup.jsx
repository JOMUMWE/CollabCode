import { useState } from 'react';
import png from '../assets/codecollab-high-resolution-logo-grayscale-transparent.png';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-hot-toast'
import { ChevronDownIcon } from "@heroicons/react/solid";


// import Authgitgoogle from '../compolnents/authgitgooge';

export default function Signup() {
  const [active, setActive] = useState(true)
  const [formData, setFormData] = useState({ name: '', email: '', phone : '', role: 'Team Manager', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState([]);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

const checkPasswordStrength = (password) => {
  const strengthCriteria = [
    { regex: /[a-z]/, message: "At least one lowercase letter" },
    { regex: /[A-Z]/, message: "At least one uppercase letter" },
    { regex: /[0-9]/, message: "At least one number" },
    { regex: /[^A-Za-z0-9]/, message: "At least one special character" },
    { regex: /.{8,}/, message: "Minimum 8 characters" },
  ];

  const criteriaStatus = strengthCriteria.map((criteria) => ({
    message: criteria.message,
    met: criteria.regex.test(password),
  }));

  setPasswordStrength(criteriaStatus);
};
  const handleSubmit = async (e) => {
    setActive(false)
    e.preventDefault();
    const { name, email, phone, role, password } = formData

    if (formData.password !== formData.confirmPassword) {
      setError('❌ Passwords do not match!');
      setActive(true)
      return;
    }

    if (!passwordStrength.includes('✅ Strong Password')) {
      setActive(true)
      setError('❌ Password is too weak!');
      return;
    }

    setError('');

    try {
      const { data } = await axios.post('/register', { name, email, phone, role, password })
      if (data.error) {
        toast.error(data.error)
        setActive(true)
      } else {
        setFormData({})
        toast.success('Login Successful. Welcome!')
        navigate('/signin')
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <a href="/">
          <img alt="Your Company" src={png} className="mx-auto h-10 w-auto" />
        </a>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign up for an account
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              autoComplete="email"
              className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
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
              className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
            />
          </div>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              pattern="[0-9]{10}"
              required
              value={formData.phone}
              onChange={handleChange}
              autoComplete="email"
              className="block w-full rounded-md bg-white px-3 py-1 text-base text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
            />
          </div>
          <div className="sm:col-span-3">
            <label
              htmlFor="role"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Role
            </label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                autoComplete="country-name"
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 outline"
              >
                <option value="Team Manager">Team Manager</option>
                <option value="Junior Developer">Junior Developer</option>
                <option value="Senior Developer">Senior Develop</option>
              </select>
              <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"} // Toggle type
                required
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="block w-full rounded-md bg-white px-3 py-1 text-sm text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.828-.642 1.63-1.1 2.386M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .274-.828.642-1.63 1.1-2.386M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 3.055l17.89 17.89"
                    />
                  </svg>
                )}
              </button>
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {passwordStrength.map((criteria, index) => (
                <li key={index} className="flex items-center">
                  {criteria.met ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                  <span
                    className={`ml-2 ${
                      criteria.met ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {criteria.message}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className="block w-full rounded-md bg-white px-3 py-1 text-sm text-gray-900 outline outline-gray-300 focus:outline-indigo-600"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.828-.642 1.63-1.1 2.386M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .274-.828.642-1.63 1.1-2.386M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 3.055l17.89 17.89"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="submit"
            className={
              active
                ? "flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
                : "flex w-full justify-center rounded-md bg-indigo-400 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
            }
          >
            {active ? "Signup" : "Signing you up..."}
          </button>
        </form>
        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Have an account?{" "}
          <a
            href="/signin"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </a>
        </p>
        {/* <Authgitgoogle /> */}
      </div>
    </div>
  );
}
