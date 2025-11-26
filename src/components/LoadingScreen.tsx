import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useInvestigationStore } from '@/store/investigationStore';

const LoadingScreen = () => {
  const setLoadingComplete = useInvestigationStore((state) => state.setLoadingComplete);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-cairo font-bold text-foreground"
        >
          جاري فتح الملف السري 409-B...
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
