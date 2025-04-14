import { motion, AnimatePresence } from "framer-motion";

const statsData = [
  {
    id: 1,
    title: "Active Users",
    value: "10,000+",
    description: "Developers collaborating on our platform",
  },
  {
    id: 2,
    title: "Projects Created",
    value: "25,000+",
    description: "Successful coding projects completed",
  },
  {
    id: 3,
    title: "Code Commits",
    value: "1M+",
    description: "Code changes tracked and managed",
  },
  {
    id: 4,
    title: "Time Saved",
    value: "500,000+",
    description: "Hours saved through real-time collaboration",
  },
];

export default function Stats({ currentIndex = 0 }) {
  const currentStat = statsData[currentIndex];

  return (
    <div className="bg-indigo-50 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-indigo-600 sm:text-4xl">
              {currentStat.title}
            </h2>
            <p className="mt-2 text-5xl font-bold tracking-tight text-gray-900">
              {currentStat.value}
            </p>
            <p className="mt-4 text-lg text-gray-600">
              {currentStat.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
