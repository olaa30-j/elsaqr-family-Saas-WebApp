import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AddButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

export const AddButton = ({ text, onClick, className = '' }: AddButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`border border-dashed border-gray-400 px-3 py-2 bg-gray-50 rounded-md transition-all duration-300 hover:bg-blue-50 cursor-pointer min-w-[120px] max-w-[150px] mx-auto ${className}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200 mb-1 overflow-hidden flex items-center justify-center">
          <Plus className="w-5 h-5 text-gray-400" />
        </div>
        <p className="font-medium text-gray-700 text-sm">{text}</p>
      </div>
    </motion.div>
  );
};