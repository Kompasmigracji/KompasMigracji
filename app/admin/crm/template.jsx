"use client";
import { motion } from "framer-motion";

export default function CrmTemplate({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      exit={{ opacity: 0, filter: 'blur(8px)', y: -15 }}
      transition={{ type: "spring", damping: 25, stiffness: 150 }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
