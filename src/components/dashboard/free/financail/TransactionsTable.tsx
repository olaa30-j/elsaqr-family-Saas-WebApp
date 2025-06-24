import { Trash2, Printer, Edit } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TransactionPDF from './TransactionPDF';
import { DEFAULT_IMAGE } from '../../../auth/RegisterationForm';
import type { Transaction } from '../../../../types/financial';

interface TransactionsTableProps {
    transactions: Transaction[];
    canEditFinancial: boolean;
    canDeleteFinancial: boolean;
    onDelete: (transaction: Transaction) => void;
    onView: (transaction: Transaction) => void;
    onEdit: (transaction: Transaction) => void;
    sortConfig?: {
        key: keyof Transaction;
        direction: 'asc' | 'desc';
    } | null;
    onSort: (key: keyof Transaction) => void;
}
const TransactionsTable = ({
    canEditFinancial,
    canDeleteFinancial,
    transactions,
    sortConfig,
    onSort,
    onDelete,
    onEdit
}: TransactionsTableProps) => {
    const getSortIcon = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) {
            return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                    stroke="currentColor" aria-hidden="true" className="w-4 h-4 opacity-50">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"></path>
                </svg>
            );
        }
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                stroke="currentColor" aria-hidden="true" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round"
                    d={sortConfig.direction === 'asc' ?
                        "M19.5 8.25l-7.5 7.5-7.5-7.5" :
                        "M4.5 15.75l7.5-7.5 7.5 7.5"}></path>
            </svg>
        );
    };

    return (
        <section className="overflow-x-auto -mt-10">
            <table className="min-w-full divide-y divide-slate-200 rounded-lg border border-primary/20">
                <thead className="bg-primary">
                    <tr className="rounded-2xl">
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"
                        >
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => onSort && onSort('name')}
                        >
                            <div className="flex items-center justify-center gap-1">
                                الاسم
                                {getSortIcon('name')}
                            </div>
                        </th>

                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider"
                        >
                            العميل
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => onSort && onSort('amount')}
                        >
                            <div className="flex items-center justify-center gap-1">
                                المبلغ
                                {getSortIcon('amount')}
                            </div>
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => onSort && onSort('type')}
                        >
                            <div className="flex items-center justify-center gap-1">
                                النوع
                                {getSortIcon('type')}
                            </div>
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => onSort && onSort('date')}
                        >
                            <div className="flex items-center justify-center gap-1">
                                التاريخ
                                {getSortIcon('date')}
                            </div>
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors"
                            onClick={() => onSort && onSort('category')}
                        >
                            <div className="flex items-center justify-center gap-1">
                                الفئة
                                {getSortIcon('category')}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-sm font-medium text-white uppercase tracking-wider">
                            الإجراءات
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {transactions.length > 0 ? (
                        [...transactions].sort((a, b) => {
                            if (!sortConfig) return 0;

                            const aValue: any = a[sortConfig.key];
                            const bValue: any = b[sortConfig.key];

                            if (aValue < bValue) {
                                return sortConfig.direction === 'asc' ? -1 : 1;
                            }
                            if (aValue > bValue) {
                                return sortConfig.direction === 'asc' ? 1 : -1;
                            }
                            return 0;
                        }).map((transaction) => (
                            <tr key={transaction._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex justify-center w-15">
                                        {transaction.image ? (
                                            <img
                                                className="w-15 h-10 rounded-md cursor-pointer hover:opacity-80"
                                                src={transaction.image}
                                                alt="Transaction"
                                                onClick={() => window.open(transaction.image, '_blank')}
                                            />
                                        ) : (
                                            <span className="text-slate-400">لا يوجد</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-center font-medium text-slate-900">
                                        {transaction.name}
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-1">
                                        {transaction.createdBy ? (
                                            <>
                                                <img
                                                    className="w-8 h-8 rounded-full mx-2"
                                                    src={transaction?.createdBy?.memberId?.image || DEFAULT_IMAGE}
                                                    alt={transaction?.createdBy?.email}
                                                />
                                                <span>{transaction.createdBy.email}</span>
                                            </>
                                        ) : (
                                            <span className="text-slate-400">غير محدد</span>
                                        )}
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-center font-medium flex gap-1 items-center text-color-2`}>
                                        {transaction.amount.toLocaleString('ar-SA')} <img src="https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg" alt="" className='w-4 h-4' />
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex justify-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-md ${transaction.type === 'income'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {transaction.type === 'income' ? 'إيراد' : 'مصروف'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-md text-slate-500 text-center">
                                    {new Date(transaction.date).toLocaleDateString('ar-SA', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex justify-center">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                                            {transaction.category}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-md font-medium text-center">
                                    <div className="flex justify-center items-center space-x-2 gap-2">
                                        {
                                            canEditFinancial && (
                                                <button
                                                    onClick={() => onEdit(transaction)}
                                                    className="text-slate-600 hover:text-yellow-600 transition-colors"
                                                    title="تعديل"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>

                                            )
                                        }
                                        {
                                            canDeleteFinancial && (
                                                <button
                                                    onClick={() => onDelete(transaction)}
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                    title="حذف"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            )
                                        }

                                        <PDFDownloadLink
                                            document={<TransactionPDF transaction={transaction} />}
                                            fileName={`transaction_${transaction._id}.pdf`}
                                        >
                                            {({ loading }) => (
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    title="طباعة"
                                                    disabled={loading}
                                                >
                                                    <Printer className="h-5 w-5" />
                                                </button>
                                            )}
                                        </PDFDownloadLink>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className="px-6 py-4 text-center text-slate-500">
                                لا توجد معاملات متاحة
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>


        </section>
    );
};

export default TransactionsTable;