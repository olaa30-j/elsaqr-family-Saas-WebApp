import { PlusCircle, Printer } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TransactionPDF from './TransactionPDF';
import { motion } from 'framer-motion';
import type { Transaction, TransactionFormValues } from '../../../../types/financial';
import Modal from '../../../ui/Modal';
import { TransactionForm } from './TransactionForm';
import { useState } from 'react';
import { useCreateTransactionMutation } from '../../../../store/api/financialApi';
import { toast } from 'react-toastify';

interface TransactionsActionsProps {
    transactions: Transaction[];
    filters: {
        typeFilter: string;
        timeFilter: string;
        debouncedSearchQuery: string;
    };
}

/**
 * Action buttons for transactions list including print and add new transaction.
 * 
 * @component
 * @param {TransactionsActionsProps} props - Component props
 */
const TransactionsActions = ({ transactions, filters }: TransactionsActionsProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [createTransaction] = useCreateTransactionMutation();

    const calculateSummary = () => {
        const total = transactions.reduce((sum, t) => sum + t.amount, 0);
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return { total, income, expense, count: transactions.length };
    };

    const { total, income, expense, count } = calculateSummary();

    const handleSubmit = async (formData: TransactionFormValues) => {
        try {
            const formDataObj = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'image') {
                        if (value instanceof File) {
                            formDataObj.append(key, value);
                        } else if (typeof value === 'string') {
                            formDataObj.append(key, value);
                        }
                    } else {
                        formDataObj.append(key, String(value));
                    }
                }
            });

            await createTransaction(formDataObj).unwrap(); 
            setIsModalOpen(false);
            toast.success("تم إضافة المعاملة بنجاح");
        } catch (error) {
            console.error('Failed to create transaction:', error);
            toast.error("فشل فى انشاء المعاملة");
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='flex flex-col md:flex-row gap-4 justify-between items-center mb-6'>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
            >
                <h3 className="text-2xl font-bold text-primary">المعاملات المالية</h3>
                <p className="text-slate-500 mt-1">قائمة بجميع المعاملات المالية</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3"
            >
                <PDFDownloadLink
                    document={
                        <TransactionPDF
                            transactions={transactions}
                            filters={filters}
                            summary={{ total, income, expense, count }}
                        />
                    }
                    fileName={`financial_report_${new Date().toISOString()}.pdf`}
                >
                    {({ loading }) => (
                        <button
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium hover:text-white bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary transition-colors"
                            disabled={loading}
                        >
                            {loading ? 'جاري التجهيز...' : (
                                <>
                                    <Printer className="h-5 w-5" />
                                    طباعة التقرير
                                </>
                            )}
                        </button>
                    )}
                </PDFDownloadLink>

                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
                >
                    <PlusCircle className="h-5 w-5" />
                    معاملة جديدة
                </motion.button>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    extraStyle='bg-primary'
                    title="إضافة معاملة جديدة"
                >
                    <TransactionForm
                        mode="add"
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </Modal>
            </motion.div>
        </div>
    );
};

export default TransactionsActions;