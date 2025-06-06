
export type Member = {
    data?: any;
    _id?: string;
    fname: string;
    lname: string;
    familyBranch: string;
    gender: 'ذكر' | 'أنثى';
    father?: string;
    birthDate: Date | string;
    birthday: Date | string;
    deathDate: Date | string;
    husband?: string;
    wives?: string[];
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    familyRelationship: string;
};

export interface FamilyTreeData {
  husband: Member | null;
  wives: Member[];
  children: Member[];
  grandChildren: Member[];
}

export interface MemberProps {
    fname: any;
    _id: string;
    title: string;
    type: 'important' | 'general';
    content: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    status: string;
    userId:Member;
    data?: any
}

export const genderOptions = [
    { value: 'ذكر', label: 'ذكر' },
    { value: 'أنثى', label: 'أنثى' }
];

export const familyBranches = [
    "الفرع الخامس",
    "الفرع الرابع",
    "الفرع الثالث",
    "الفرع الثاني",
    "الفرع الاول",
];