import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Loading = ({ message = "Loading your training space...", duration = 1200 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-base-100 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* Background glow */}
        <div className="absolute w-56 h-56 bg-primary/10 blur-3xl rounded-full" />

        {/* Dumbbell animation */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{
            opacity: 1,
            y: [0, -8, 0],
            scale: 1,
          }}
          transition={{
            opacity: { duration: 0.4 },
            y: {
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            },
            scale: { duration: 0.4 },
          }}
          className="relative z-10"
        >
          <div className="flex items-center justify-center">
            {/* Left plates */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-4 h-14 rounded-l-xl bg-primary shadow-lg"
            />
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.2, delay: 0.08, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-20 rounded-l-2xl bg-primary/90 shadow-xl"
            />

            {/* Handle */}
            <motion.div
              animate={{ opacity: [0.75, 1, 0.75] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-28 h-4 bg-base-content rounded-full mx-1 shadow-inner"
            />

            {/* Right plates */}
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.2, delay: 0.08, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-20 rounded-r-2xl bg-primary/90 shadow-xl"
            />
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-4 h-14 rounded-r-xl bg-primary shadow-lg"
            />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="relative z-10 text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-base-content mb-2">
            FitFlow
          </h2>
          <p className="text-base-content/70 text-sm sm:text-base font-medium tracking-wide max-w-sm">
            {message}
          </p>
        </motion.div>

        {/* Animated loading dots */}
        <div className="relative z-10 flex items-center gap-2">
          <motion.div
            className="w-2.5 h-2.5 bg-primary rounded-full"
            animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2.5 h-2.5 bg-primary rounded-full"
            animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
          />
          <motion.div
            className="w-2.5 h-2.5 bg-primary rounded-full"
            animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;