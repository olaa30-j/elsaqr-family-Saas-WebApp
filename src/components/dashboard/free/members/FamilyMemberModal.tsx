import React from 'react';
import { formatArabicDate } from '../../../../utils/utils';
import type { Member } from '../../../../types/member';

interface FamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

const FamilyMemberModal: React.FC<FamilyMemberModalProps> = ({
  isOpen,
  onClose,
  member
}) => {
  if (!isOpen || !member) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        
        <div className="modal-header">
          <h2>
            {member.fname} {member.lname}
            <span className="member-role">{member.familyRelationship}</span>
          </h2>
        </div>
        
        <div className="modal-body">
          <div className="member-image">
            {member.image ? (
              <img src={member.image} alt={`${member.fname} ${member.lname}`} />
            ) : (
              <div className="image-placeholder">
                {member.familyRelationship === 'زوج' || member.familyRelationship === 'ابن' ? '👨' : '👩'}
              </div>
            )}
          </div>
          
          <div className="member-details">
            <div className="detail-row">
              <span className="detail-label">تاريخ الميلاد:</span>
              <span>{formatArabicDate(member.birthDate)}</span>
            </div>
            
            {member.deathDate && (
              <div className="detail-row">
                <span className="detail-label">تاريخ الوفاة:</span>
                <span>{formatArabicDate(member.deathDate)}</span>
              </div>
            )}
            
            <div className="detail-row">
              <span className="detail-label">الفرع:</span>
              <span>{member.familyBranch}</span>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="btn-edit">تعديل البيانات</button>
          <button className="btn-close" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberModal;