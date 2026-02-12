import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 500);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ background: "hsl(270 30% 6%)" }}
        >
          {/* Animated orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-[80px]"
              style={{ background: "hsl(270 70% 55%)" }}
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full blur-[80px]"
              style={{ background: "hsl(330 80% 60%)" }}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px]"
              style={{ background: "hsl(220 80% 60%)" }}
            />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 150, delay: 0.3 }}
            className="relative z-10 flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 rounded-full opacity-30"
              style={{
                background: "conic-gradient(from 0deg, hsl(270 70% 55%), hsl(330 80% 60%), hsl(220 80% 60%), hsl(45 90% 55%), hsl(270 70% 55%))",
              }}
            />
            <Sparkles className="w-12 h-12 relative z-10" style={{ color: "hsl(270 70% 65%)" }} />
            <h1
              className="text-5xl font-extrabold relative z-10"
              style={{
                background: "linear-gradient(135deg, hsl(270 70% 65%), hsl(330 80% 65%), hsl(220 80% 65%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Aura
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm tracking-widest uppercase"
              style={{ color: "hsl(270 10% 60%)" }}
            >
              Find your vibe
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
