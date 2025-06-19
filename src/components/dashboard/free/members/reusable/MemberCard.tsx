import type { FamilyRelationship, Gender, GetMembers } from '../../../../../types/member';
import { DEFAULT_IMAGE } from '../../../../auth/RegisterationForm';

interface MemberCardProps {
  member: GetMembers;
  role: FamilyRelationship;
  onClick?: () => void;
  className?: string;
}

export const MemberCard = ({ member, role, onClick, className = '' }: MemberCardProps) => {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'غير معروف';
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'غير معروف' : d.toLocaleDateString('ar-EG');
  };

  const determineGender = (): Gender => {
    if (member.gender) return member.gender;
    return (member.familyRelationship === 'ابن' || member.familyRelationship === 'زوج') 
      ? 'ذكر' 
      : 'أنثى';
  };

  const gender = determineGender();

  return (
    <div 
      className={`flex flex-col items-center min-w-[120px] max-w-[150px] mx-2 relative ${className}`}
      onClick={onClick}
    >
      <div className="w-full h-48 bg-gray-200 mb-2 overflow-hidden flex items-center justify-center border border-gray-300 rounded-md">
        {member.image ? (
          <img
            src={member.image || DEFAULT_IMAGE}
            alt={`${member.fname} ${member.lname}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400 text-4xl">
            {gender === 'ذكر' ? '👨' : '👩'}
          </div>
        )}
      </div>

      <div className="text-center w-full">
        <p className="font-medium text-gray-700 text-sm leading-tight truncate">
          {member.fname} {member.lname}
        </p>
        <p className="text-xs text-gray-400">({role})</p>
        <div className="text-xs text-gray-500 mt-1">
          <p>{formatDate(member.birthday)}</p>
          {member.deathDate && <p>{formatDate(member.deathDate)}</p>}
        </div>
      </div>
    </div>
  );
};