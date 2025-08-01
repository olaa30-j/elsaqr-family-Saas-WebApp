import type { IBranchForm } from "./branch";

export type Gender = "ذكر" | "أنثى";

export type FamilyRelationship =
  | "ابن"
  | "ابنة"
  | "زوجة"
  | "زوج"
  | "حفيد"
  | "حفيدة"
  | "أخرى"
  | "الجد الأعلى"; 

export interface Member {
    data?: any;
    _id?: string;
    userId?: string;
    fname: string;
    lname: string;
    gender: "ذكر" | "أنثى";
    familyBranch: string;
    familyRelationship: FamilyRelationship;
    birthday?: Date | string;
    deathDate?: Date | string;
    summary?: string;
    husband?: string;
    parents?: {
        father?: string;
        mother?: string;
    };
    wives?: string[];
    children?: string[];
    image?: string;
    isUser?: boolean;
    createdAt?: string;
    updatedAt?: string;
    isFamilyHead?: boolean;
}


export interface GetMembers {
    data?: any;
    _id?: string;
    userId?: {
        _id: string;
        email:string;
        role: string[];
    };
    fname: string;
    lname: string;
    gender: "ذكر" | "أنثى";
    familyBranch: IBranchForm;
    familyRelationship: FamilyRelationship;
    birthday?: Date | string;
    deathDate?: Date | string;
    summary?: string;
    parents?: {
        father?: {
            _id: string;
            userId?: string;
            fname: string;
            lname: string;
            gender: "ذكر" | "أنثى";
            familyBranch:  IBranchForm | string;
            familyRelationship: FamilyRelationship;
            birthday?: Date | string;
            deathDate?: Date | string;
            summary?: string;
            
        } | string;
        mother?: {
            _id: string;
            userId?: string;
            fname: string;
            lname: string;
            gender: "ذكر" | "أنثى";
            familyBranch:  IBranchForm | string;
            familyRelationship: FamilyRelationship;
        } | string;
    };
    husband?: {
        _id: string;
        userId?: string;
        fname: string;
        lname: string;
        gender: "ذكر" | "أنثى";
        familyBranch:  IBranchForm | string;
        familyRelationship: FamilyRelationship;
    };
    wives?: {
        _id: string;
        userId?: string;
        fname: string;
        lname: string;
        gender: "ذكر" | "أنثى";
        familyBranch:  IBranchForm | string;
        familyRelationship: FamilyRelationship;
    }[];
    children?: {
        _id: string;
        userId?: string;
        fname: string;
        lname: string;
        gender: "ذكر" | "أنثى";
        familyBranch:  IBranchForm | string;
        familyRelationship: FamilyRelationship;
    }[];
    image?: string;
    isUser?: boolean;
    createdAt?: string;
    updatedAt?: string;
    isFamilyHead?: boolean;
}


export interface FamilyTreeData {
    husband: Member | null;
    wives: Member[];
    children: Member[];
    grandchildren: Member[];
}

export interface MemberCardProps {
    _id: string;
    title: string;
    type: "important" | "general";
    content: string;
    status: "active" | "inactive" | "deceased";
    userId: Member | string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
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
    userId: Member;
    data?: any
}

export const genderOptions = [
    { value: 'ذكر', label: 'ذكر' },
    { value: 'أنثى', label: 'أنثى' }
];

export const familyRelationshipOptions = [
    { value: "ابن", label: "ابن" },
    { value: "ابنة", label: "ابنة" },
    { value: "زوج", label: "زوج" },
    { value: "زوجة", label: "زوجة" },
    { value: "أخرى", label: "أخرى" },
];