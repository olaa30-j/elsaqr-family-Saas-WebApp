import { motion } from 'framer-motion';
import { MemberCard } from './MemberCard';
import { ConnectionLine } from './ConnectionLine';

interface FamilyNodeProps {
  member: any;  
  role: string;
  children?: React.ReactNode;
  isMain?: boolean;
  isCurrent?: boolean;
  onClick?: () => void;
  className?: string;
}

export const FamilyNode = ({
  member,
  role,
  children,
  isMain = false,
  isCurrent = false,
  onClick,
  className = ''
}: FamilyNodeProps) => {
  const bgColor = isCurrent ? 'bg-purple-100 hover:bg-purple-200' : 
                  isMain ? 'bg-white' : 'bg-white hover:bg-primary/10';
  
  return (
    <div className={`relative ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`border border-gray-300 px-3 py-2 rounded-md transition-all duration-300 w-fit mx-auto ${bgColor}`}
        onClick={onClick}
      >
        <MemberCard member={member} role={role as any} />
      </motion.div>

      {isMain && (
        <div className="absolute -bottom-6 left-0 right-2 h-24 flex justify-center pointer-events-none z-[-1]">
          <ConnectionLine type="spouse" />
        </div>
      )}

      {children && (
        <div className="relative pt-6">
          <div className="absolute top-0 left-0 right-0 h-6 flex justify-center">
            <ConnectionLine type="parent" />
          </div>
          {children}
        </div>
      )}
    </div>
  );
};