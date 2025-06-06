import type { Member } from "../types/member";

export const formatArabicDate = (date?: string | Date) => {
  if (!date) return 'غير معروف';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'غير معروف';
  
  return d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getMemberRelations = (members: Member[]) => {
  const relations: Record<string, string[]> = {};
  
  members.forEach(member => {
    if (member._id && member.data?.motherId) {
      relations[member.data.motherId] = relations[member.data.motherId] || [];
      relations[member.data.motherId].push(member._id);
    }
    if (member._id && member.data?.parentId) {
      relations[member.data.parentId] = relations[member.data.parentId] || [];
      relations[member.data.parentId].push(member._id);
    }
  });
  
  return relations;
};