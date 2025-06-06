import React from 'react';
import type { Member } from '../../../../types/member';
import FamilyMemberNode from './FamilyMemberNode';

interface ChildrenBranchProps {
  parentId: string;
  members: Member[] | null;
  relations: Record<string, string[]>;
  onClick: (member: Member) => void;
}

const ChildrenBranch: React.FC<ChildrenBranchProps> = ({
  parentId,
  members,
  relations,
  onClick
}) => {
  const children = members!.filter(m => 
    m.data?.motherId === parentId || m.data?.parentId === parentId
  );

  if (children.length === 0) return null;

  return (
    <div className="children-branch">
      <div className="connection-line parent-connection" />
      
      <div className="children-container">
        {children.map(child => (
          <div key={child._id} className="child-node">
            <FamilyMemberNode
              member={child}
              role={child.familyRelationship}
              onClick={onClick}
            />
            
            {/* عرض الأحفاد إذا وجدوا */}
            {child._id && relations[child._id]?.length > 0 && (
              <ChildrenBranch
                parentId={child._id}
                members={members}
                relations={relations}
                onClick={onClick}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChildrenBranch;