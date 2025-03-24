import { useState } from "react";
import axios from "axios";
import NAV from "../components/NAV";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "/submitContactForm",
        formData
      );
      toast.success("Thankyou for contacting us. We will get back to you shortly.");
      setFormData({
        firstName: "",
        lastName: "",
        company: "",
        email: "",
        phoneNumber: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit the form. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
      <NAV />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Contact Sales
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Send us an email using this form and we will get back to you
          immediately.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 max-w-xl sm:mt-20 mb-8 sm:mb-10"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-semibold text-gray-900"
            >
              First name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-semibold text-gray-900"
            >
              Last name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="company"
              className="block text-sm font-semibold text-gray-900"
            >
              Company
            </label>
            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-900"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-semibold text-gray-900"
            >
              Phone number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
            />
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-gray-900"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
              required
            />
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus:outline-2 focus:outline-indigo-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Let's talk"}
          </button>
        </div>
      </form>
      <Footer />
    </div>
  );
}
