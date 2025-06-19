import { motion } from 'framer-motion';
import { FamilyNode } from './FamilyNode';
import { AddButton } from './AddButton';
import { ConnectionLine } from './ConnectionLine';

interface ChildrenListProps {
  children: any[]; 
  parentId?: string;
  motherId?: string;
  onAddChild?: () => void;
  className?: string;
}

export const ChildrenList = ({ 
  children, 
  onAddChild,
  className = ''
}: ChildrenListProps) => {
  const sons = children.filter(child => child.gender === 'ذكر');
  const daughters = children.filter(child => child.gender === 'أنثى');

  if (children.length === 0) {
    return (
      <div className={`relative pt-6 family-connector ${className}`}>
        <div className="absolute top-0 left-0 right-0 h-6 flex justify-center">
          <ConnectionLine type="parent" />
        </div>
        <AddButton text="إضافة ابن/ابنة" onClick={onAddChild} />
      </div>
    );
  }

  return (
    <div className={`relative pt-6 family-connector ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-6 flex justify-center">
        <ConnectionLine type="parent" />
      </div>

      <ul className="flex justify-center">
        {daughters.map((daughter, index) => (
          <motion.li
            key={daughter._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative px-2"
          >
            {children.length > 1 && (
              <div className="absolute top-0 left-0 right-0 h-10 flex justify-center">
                <ConnectionLine 
                  type="sibling"
                  position={
                    index === 0 && daughters.length === 0 ? 'last' :
                    index === sons.length - 1 ? 'first' :
                    'middle'
                  }
                />
              </div>
            )}

            <div className={`${children.length > 1 ? 'pt-6' : 'pt-0'}`}>
              <FamilyNode 
                member={daughter} 
                role="ابنة" 
                className="hover:bg-purple-50"
              />
            </div>
          </motion.li>
        ))}

        {sons.map((son, index) => (
          <motion.li
            key={son._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative px-2"
          >
            {children.length > 1 && (
              <div className="absolute top-0 left-0 right-0 h-10 flex justify-center">
                <ConnectionLine 
                  type="sibling"
                  position={
                    index === 0 && daughters.length === 0 ? 'first' :
                    index === sons.length - 1 ? 'last' :
                    'middle'
                  }
                />
              </div>
            )}

            <div className={`${children.length > 1 ? 'pt-6' : 'pt-0'}`}>
              <FamilyNode 
                member={son} 
                role="ابن" 
                className="hover:bg-primary/10"
              />
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};