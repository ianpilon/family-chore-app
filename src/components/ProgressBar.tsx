import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  isNewRecord: boolean;
}

export function ProgressBar({ progress, isNewRecord }: ProgressBarProps) {
  return (
    <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className={`absolute left-0 top-0 h-full rounded-full ${
          isNewRecord ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-blue-500'
        }`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {isNewRecord && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{
            x: ["0%", "100%"],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </div>
  );
}