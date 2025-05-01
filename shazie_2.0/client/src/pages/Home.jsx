"use client";
import * as motion from "motion/react-client"
import Footer from "../components/Footer";
import NAV from "../components/NAV";
import Stats from "../components/Stats";
import {useState, useEffect,useRef} from "react";

const features = [
  {
    name: "Real-Time Collaboration",
    description:
      "Work together seamlessly with your team on the same codebase in real-time, making development faster and more efficient.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
        />
      </svg>
    ),
  },
  {
    name: "End-to-End Security",
    description:
      "Your code is protected with industry-standard encryption and security measures, ensuring safe and private collaboration.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
        />
      </svg>
    ),
  },
  {
    name: "Seamless Version Control",
    description:
      "Integrate directly with GitHub and GitLab, allowing you to manage versions, branches, and collaboration without leaving the platform.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
        />
      </svg>
    ),
  },
  {
    name: "AI-Powered Code Assistance",
    description:
      "Leverage AI-driven suggestions to improve your code, detect issues, and optimize performance effortlessly.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
        />
      </svg>
    ),
  },
];

export default function Home() {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const statsCarouselRef = useRef(null);

  // Auto-rotate stats every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prevIndex) => {
        // Assuming Stats component has a way to determine total number of stats
        // You might need to adjust this logic based on your Stats component implementation
        const nextIndex = (prevIndex + 1) % 4; // Assuming 4 stats, adjust as needed
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStatChange = (index) => {
    setCurrentStatIndex(index);
  };

  return (
    <>
      <div className="bg-gradient-to-b from-white to-indigo-50/30">
        <NAV />

        <div className="relative isolate px-6 lg:px-8">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] animate-pulse"
            />
          </div>
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 flex justify-center"
              >
                <span className="relative inline-flex overflow-hidden rounded-full p-[1px]">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-gradient-to-r from-[#ff80b5] via-[#9089fc] to-[#ff80b5]" />
                  <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950/90 px-3 py-1 text-sm font-medium text-gray-50 backdrop-blur-3xl">
                    <span className="animate-pulse">✨ Welcome to the future of coding ✨</span>
                  </div>
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: [0, 0.71, 0.2, 1.01]
                }}
                className="text-6xl font-extrabold tracking-tight text-balance text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-7xl"
              >
                Collaborate on Code
                <br />
                <span className="text-gray-900">in Real-Time</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 text-lg font-medium text-pretty text-gray-600 sm:text-xl/8 leading-relaxed"
              >
                Work together seamlessly on code with CollabCode.
                <br />
                Experience real-time collaboration like never before.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mt-10 flex items-center justify-center gap-x-6"
              >
                <a
                  href="/signup"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white transition duration-300 ease-out hover:scale-105"
                >
                  <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-700"></span>
                  <span className="ease absolute bottom-0 right-0 mb-32 mr-4 block h-64 w-64 origin-bottom-left translate-x-24 rotate-45 transform rounded-full bg-pink-500 opacity-30 transition duration-500 group-hover:rotate-90"></span>
                  <span className="relative">Get started</span>
                </a>
              </motion.div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>

      {/* Stats Carousel */}
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-50/30 to-white" ref={statsCarouselRef}>
        <div className="relative">
          <Stats currentIndex={currentStatIndex} />

          {/* Carousel Navigation Dots */}
          <div className="flex justify-center mt-4 space-x-3">
            {[0, 1, 2, 3].map((index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleStatChange(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  currentStatIndex === index 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 scale-125" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to stat ${index + 1}`}
              />
            ))}
          </div>

          {/* Carousel Navigation Arrows */}
          <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentStatIndex((prev) => (prev - 1 + 4) % 4)}
              className="p-3 rounded-full bg-white/90 shadow-lg pointer-events-auto hover:bg-white transition-all duration-300"
              aria-label="Previous stat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentStatIndex((prev) => (prev + 1) % 4)}
              className="p-3 rounded-full bg-white/90 shadow-lg pointer-events-auto hover:bg-white transition-all duration-300"
              aria-label="Next stat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
      <div id="features" className="bg-gradient-to-b from-white to-indigo-50/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mx-auto max-w-2xl lg:text-center"
          >
            <h2 className="text-base/7 font-semibold text-indigo-600">
              Why Choose CollabCode?
            </h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-pretty text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 sm:text-5xl lg:text-balance">
              Features Designed for Seamless Coding Collaboration
            </p>
          </motion.div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-16 hover:transform hover:scale-105 transition-all duration-300"
                >
                  <dt className="text-base/7 font-semibold text-gray-900">
                    <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
                      {feature.icon}
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base/7 text-gray-600">
                    {feature.description}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
