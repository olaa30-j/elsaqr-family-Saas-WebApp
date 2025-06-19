import type { IBranchForm } from "./branch";

interface User {
    email: string | undefined;
    _id: string;
    memberId: {
      fname: string;
      lname: string;
      familyBranch: IBranchForm;
      image?: string;
    }
}

export interface Transaction {
    _id: string;
    name: string;
    amount: number;
    type: 'income' | 'expense';
    date: string;
    category: string;
    createdBy?: User;
    image?: string;
    referenceNumber?: string;
    description?: string;
}

export interface TransactionFormProps {
    mode: 'add' | 'edit';
    initialData?: TransactionFormValues;
    onSubmit: (data: TransactionFormValues) => Promise<void>;
    onCancel: () => void;
}

export type TransactionFormValues = {
    _id?: string;
    name: string;
    amount: number;
    date: string;
    category: string;
    type: 'income' | 'expense';
    description?: string;
    image: string | File | null;
};